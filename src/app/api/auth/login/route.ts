import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase';

export async function POST(request: Request) {
  const { email, password } = await request.json() as { email: string; password: string };
  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from('clients')
    .select('email, company, name')
    .ilike('email', email)
    .eq('password', password)
    .single();

  if (error || !data) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      email: data.email as string,
      company: data.company as string,
      name: data.name as string,
    },
  });
}
