import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const storeId = searchParams.get('store_id');
  const category = searchParams.get('category');
  const limit = Number(searchParams.get('limit') ?? '20');
  const offset = Number(searchParams.get('offset') ?? '0');

  const search = searchParams.get('search');

  const sort = searchParams.get('sort');

  let query = supabase
    .from('deals')
    .select('*, store:stores(*)')
    .order(sort === 'savings' ? 'price' : 'created_at', { ascending: sort === 'savings' })
    .range(offset, offset + limit - 1);

  if (storeId) query = query.eq('store_id', storeId);
  if (category) query = query.eq('category', category);
  if (search) query = query.ilike('product_name', `%${search}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabase.from('deals').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
