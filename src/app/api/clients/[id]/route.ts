import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase';
import type { ClientRecord, PriceTier } from '@/lib/admin';

function toClientRecord(row: Record<string, unknown>): ClientRecord {
  return {
    id: row.id as string,
    email: row.email as string,
    password: row.password as string,
    company: row.company as string,
    name: row.name as string,
    enabledProducts: row.enabled_products as string[],
    customPricing: (row.custom_pricing ?? {}) as Record<string, PriceTier[]>,
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createSupabaseServer();
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ client: toClientRecord(data) });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json() as Partial<Omit<ClientRecord, 'id'>>;
  const supabase = createSupabaseServer();

  const updates: Record<string, unknown> = {};
  if (body.email !== undefined) updates.email = body.email;
  if (body.password !== undefined) updates.password = body.password;
  if (body.company !== undefined) updates.company = body.company;
  if (body.name !== undefined) updates.name = body.name;
  if (body.enabledProducts !== undefined) updates.enabled_products = body.enabledProducts;
  if (body.customPricing !== undefined) updates.custom_pricing = body.customPricing;

  const { error } = await supabase.from('clients').update(updates).eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createSupabaseServer();
  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
