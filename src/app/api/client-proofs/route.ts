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
    .from('client_proofs')
    .select('proof_id')
    .eq('client_id', clientId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const proofIds = (data ?? []).map((row) => row.proof_id as string);
  return NextResponse.json({ proofIds });
}

export async function POST(request: Request) {
  const body = await request.json() as { clientId: string; proofIds: string[] };
  const { clientId, proofIds } = body;

  if (!clientId || !Array.isArray(proofIds)) {
    return NextResponse.json({ error: 'clientId and proofIds are required' }, { status: 400 });
  }

  const supabase = createSupabaseServer();

  // Delete all existing proofs for this client
  const { error: deleteError } = await supabase
    .from('client_proofs')
    .delete()
    .eq('client_id', clientId);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  // Insert new proofs
  if (proofIds.length > 0) {
    const { error: insertError } = await supabase
      .from('client_proofs')
      .insert(proofIds.map((proofId) => ({ client_id: clientId, proof_id: proofId })));

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
