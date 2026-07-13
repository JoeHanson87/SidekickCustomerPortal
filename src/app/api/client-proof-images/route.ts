import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('clientId');

  if (!clientId) {
    return NextResponse.json({ error: 'clientId is required' }, { status: 400 });
  }

  const supabase = createSupabaseServer();
  const { data, error } = await supabase
    .from('client_proof_images')
    .select('proof_image_id')
    .eq('client_id', clientId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const proofImageIds = (data ?? []).map((row) => row.proof_image_id as string);
  return NextResponse.json({ proofImageIds });
}

export async function POST(request: Request) {
  const body = await request.json() as { clientId: string; proofImageIds: string[] };
  const { clientId, proofImageIds } = body;

  if (!clientId || !Array.isArray(proofImageIds)) {
    return NextResponse.json({ error: 'clientId and proofImageIds are required' }, { status: 400 });
  }

  const supabase = createSupabaseServer();

  // Delete all existing proof images for this client
  const { error: deleteError } = await supabase
    .from('client_proof_images')
    .delete()
    .eq('client_id', clientId);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  // Insert new proof images
  if (proofImageIds.length > 0) {
    const { error: insertError } = await supabase
      .from('client_proof_images')
      .insert(proofImageIds.map((proofImageId) => ({ client_id: clientId, proof_image_id: proofImageId })));

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
