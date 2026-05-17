import { NextRequest, NextResponse } from 'next/server';
import { getExtractionModel } from '@/lib/gemini';
import { ExtractedDeal } from '@/lib/types';

function stripMarkdown(text: string): string {
  return text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
}

export async function POST(req: NextRequest) {
  const { text, store_id } = await req.json();
  if (!text?.trim()) return NextResponse.json({ error: 'No text provided' }, { status: 400 });

  const model = getExtractionModel();
  let extracted: ExtractedDeal;

  try {
    const geminiResult = await model.generateContent([
      { text: `Extract the grocery deal from this text:\n\n${text}` },
    ]);
    const raw = geminiResult.response.text().trim();
    extracted = JSON.parse(stripMarkdown(raw));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Could not parse deal. (${message})` }, { status: 422 });
  }

  if ('error' in extracted && extracted.error) {
    return NextResponse.json({ error: extracted.error }, { status: 422 });
  }

  return NextResponse.json({ ...extracted, image_url: null, store_id: store_id ?? null });
}
