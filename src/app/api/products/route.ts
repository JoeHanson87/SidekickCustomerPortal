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

export async function GET() {
  const supabase = createSupabaseServer();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ products: (data ?? []).map(toProductRecord) });
}

export async function POST(request: Request) {
  const body = await request.json() as ProductCategory;
  const supabase = createSupabaseServer();

  const id = body.id || Date.now().toString();
  const { error } = await supabase.from('products').insert({
    id,
    name: body.name,
    description: body.description,
    tagline: body.tagline,
    color_from: body.colorFrom,
    color_to: body.colorTo,
    proofs: body.proofs,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ product: { ...body, id } as ProductCategory });
}
