import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createSupabaseServer();

  // Fetch the record first to get the storage path
  const { data, error: fetchError } = await supabase
    .from('proof_images')
    .select('storage_path')
    .eq('id', id)
    .single();

  if (fetchError || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const storagePath = (data as Record<string, unknown>).storage_path as string;

  // Remove from storage
  await supabase.storage.from('proof-images').remove([storagePath]);

  // Remove from database
  const { error: deleteError } = await supabase.from('proof_images').delete().eq('id', id);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
