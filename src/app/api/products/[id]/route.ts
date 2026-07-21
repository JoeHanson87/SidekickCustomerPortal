import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase';
import type { ProductCategory, Proof } from '@/lib/products';

function toProductRecord(row: Record<string, unknown>): ProductCategory {
  const proofs = (row.proofs ?? []) as Proof[];
  return {
    id: row.id as string,
    name: row.name as string,
    description: row.description as string,
    tagline: row.tagline as string,
    colorFrom: row.color_from as string,
    colorTo: row.color_to as string,
    proofs: proofs.map((proof) => ({
      id: proof.id,
      name: proof.name,
      description: proof.description,
      specifications: proof.specifications,
      priceTiers: proof.priceTiers.map((tier) => ({
        quantity: tier.quantity,
        unitPrice: tier.unitPrice,
        total: tier.total,
      })),
    })),
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createSupabaseServer();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ product: toProductRecord(data) });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json() as Partial<ProductCategory>;
  const supabase = createSupabaseServer();

  const updates: Record<string, unknown> = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.description !== undefined) updates.description = body.description;
  if (body.tagline !== undefined) updates.tagline = body.tagline;
  if (body.colorFrom !== undefined) updates.color_from = body.colorFrom;
  if (body.colorTo !== undefined) updates.color_to = body.colorTo;
  if (body.proofs !== undefined) updates.proofs = body.proofs;
  updates.updated_at = new Date().toISOString();

  const { error } = await supabase.from('products').update(updates).eq('id', id);
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
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
