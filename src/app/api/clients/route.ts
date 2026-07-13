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

export async function GET() {
  const supabase = createSupabaseServer();
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ clients: (data ?? []).map(toClientRecord) });
}

export async function POST(request: Request) {
  const body = await request.json() as Omit<ClientRecord, 'id'>;
  const supabase = createSupabaseServer();

  const id = Date.now().toString();
  const { error } = await supabase.from('clients').insert({
    id,
    email: body.email,
    password: body.password,
    company: body.company,
    name: body.name,
    enabled_products: body.enabledProducts,
    custom_pricing: body.customPricing ?? {},
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ client: { ...body, id } as ClientRecord });
}
