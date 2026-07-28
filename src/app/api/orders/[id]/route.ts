import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase';
import type { OrderRecord, OrderItemRecord } from '../route';

function toOrderRecord(row: Record<string, unknown>): OrderRecord {
  return {
    id: row.id as string,
    clientId: row.client_id as string,
    contactName: row.contact_name as string,
    contactEmail: row.contact_email as string,
    company: row.company as string,
    phone: (row.phone as string) ?? '',
    poNumber: (row.po_number as string) ?? '',
    deliveryLine1: row.delivery_line1 as string,
    deliveryLine2: (row.delivery_line2 as string) ?? '',
    deliveryCity: row.delivery_city as string,
    deliveryPostcode: row.delivery_postcode as string,
    notes: (row.notes as string) ?? '',
    subtotal: Number(row.subtotal),
    vat: Number(row.vat),
    grandTotal: Number(row.grand_total),
    status: (row.status as string) ?? 'pending',
    createdAt: (row.created_at as string) ?? '',
    updatedAt: (row.updated_at as string) ?? '',
    items: [],
  };
}

function toOrderItemRecord(row: Record<string, unknown>): OrderItemRecord {
  return {
    id: Number(row.id),
    orderId: row.order_id as string,
    categoryId: row.category_id as string,
    categoryName: row.category_name as string,
    proofId: row.proof_id as string,
    proofName: row.proof_name as string,
    quantity: Number(row.quantity),
    unitPrice: Number(row.unit_price),
    total: Number(row.total),
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createSupabaseServer();

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', id);

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 });
  }

  const record = toOrderRecord(order);
  record.items = (items ?? []).map(toOrderItemRecord);

  return NextResponse.json({ order: record });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json() as { status?: string };
  const supabase = createSupabaseServer();

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.status !== undefined) updates.status = body.status;

  const { error } = await supabase.from('orders').update(updates).eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
