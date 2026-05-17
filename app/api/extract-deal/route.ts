import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { getExtractionModel } from '@/lib/gemini';
import { ExtractedDeal } from '@/lib/types';

const MIME_FROM_EXT: Record<string, string> = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg',
  png: 'image/png', webp: 'image/webp', gif: 'image/gif',
};
const SUPPORTED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

function resolveMime(file: File): string {
  if (file.type && SUPPORTED.has(file.type)) return file.type;
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  return MIME_FROM_EXT[ext] ?? 'image/jpeg';
}

function stripMarkdown(text: string): string {
  return text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const image = formData.get('image') as File | null;
  const storeId = formData.get('store_id') as string | null;

  if (!image) return NextResponse.json({ error: 'No image provided' }, { status: 400 });

  const mimeType = resolveMime(image);
  const bytes = await image.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Upload to Supabase Storage
  const supabase = getServiceClient();
  const ext = mimeType.split('/')[1] ?? 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('deal-snaps')
    .upload(fileName, buffer, { contentType: mimeType, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from('deal-snaps').getPublicUrl(fileName);
  const imageUrl = urlData.publicUrl;

  // Call Gemini
  const base64 = buffer.toString('base64');
  const model = getExtractionModel();
  let extracted: ExtractedDeal;

  try {
    const geminiResult = await model.generateContent([
      { text: 'Extract the grocery deal from this image. Look for any visible price and product text.' },
      {
        inlineData: {
          mimeType: mimeType as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif',
          data: base64,
        },
      },
    ]);
    const raw = geminiResult.response.text().trim();
    const cleaned = stripMarkdown(raw);
    extracted = JSON.parse(cleaned);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Could not read the image — try a clearer photo. (${message})` },
      { status: 422 }
    );
  }

  if ('error' in extracted && extracted.error) {
    return NextResponse.json({ error: extracted.error }, { status: 422 });
  }

  // Return extracted data + image_url; client confirms before DB insert
  return NextResponse.json({ ...extracted, image_url: imageUrl, store_id: storeId });
}
