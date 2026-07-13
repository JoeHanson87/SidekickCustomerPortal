import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase';

export interface ProofImageRecord {
  id: string;
  categoryId: string;
  proofId: string;
  imageUrl: string;
  storagePath: string;
  uploadedAt: string;
}

function toRecord(row: Record<string, unknown>): ProofImageRecord {
  return {
    id: row.id as string,
    categoryId: row.category_id as string,
    proofId: row.proof_id as string,
    imageUrl: row.image_url as string,
    storagePath: row.storage_path as string,
    uploadedAt: row.uploaded_at as string,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId');
  const proofId = searchParams.get('proofId');

  const supabase = createSupabaseServer();
  let query = supabase.from('proof_images').select('*');
  if (categoryId) query = query.eq('category_id', categoryId);
  if (proofId) query = query.eq('proof_id', proofId);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ images: (data ?? []).map(toRecord) });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const categoryId = formData.get('categoryId') as string | null;
  const proofId = formData.get('proofId') as string | null;

  if (!file || !categoryId || !proofId) {
    return NextResponse.json({ error: 'file, categoryId and proofId are required' }, { status: 400 });
  }

  const supabase = createSupabaseServer();

  // Upload file to Supabase Storage
  const ext = file.name.split('.').pop() ?? 'jpg';
  const storagePath = `${categoryId}/${proofId}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from('proof-images')
    .upload(storagePath, arrayBuffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from('proof-images')
    .getPublicUrl(storagePath);
  const imageUrl = urlData.publicUrl;

  // Upsert the record in the database (one image per category+proof)
  const id = `${categoryId}-${proofId}`;
  const { error: dbError } = await supabase.from('proof_images').upsert({
    id,
    category_id: categoryId,
    proof_id: proofId,
    image_url: imageUrl,
    storage_path: storagePath,
    uploaded_at: new Date().toISOString(),
  });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({
    image: {
      id,
      categoryId,
      proofId,
      imageUrl,
      storagePath,
      uploadedAt: new Date().toISOString(),
    } as ProofImageRecord,
  });
}
