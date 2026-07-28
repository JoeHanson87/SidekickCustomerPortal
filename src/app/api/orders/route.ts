import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase';
import type { CartItem } from '@/context/CartContext';

export interface OrderRecord {
  id: string;
  clientId: string;
  contactName: string;
  contactEmail: string;
  company: string;
  phone: string;
  poNumber: string;
  deliveryLine1: string;
  deliveryLine2: string;
  deliveryCity: string;
  deliveryPostcode: string;
  notes: string;
  subtotal: number;
  vat: number;
  grandTotal: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItemRecord[];
}

export interface OrderItemRecord {
  id: number;
  orderId: string;
  categoryId: string;
  categoryName: string;
  proofId: string;
  proofName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export async function GET() {
  const supabase = createSupabaseServer();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: (data ?? []).map(toOrderRecord) });
}

export async function POST(request: Request) {
  const body = await request.json() as {
    clientId: string;
    contactName: string;
    contactEmail: string;
    company: string;
    phone?: string;
    poNumber?: string;
    deliveryLine1: string;
    deliveryLine2?: string;
    deliveryCity: string;
    deliveryPostcode: string;
    notes?: string;
    subtotal: number;
    vat: number;
    grandTotal: number;
    items: CartItem[];
  };

  const orderId = `SK-${Date.now().toString(36).toUpperCase()}`;
  const now = new Date().toISOString();
  const supabase = createSupabaseServer();

  const { error: orderError } = await supabase.from('orders').insert({
    id: orderId,
    client_id: body.clientId,
    contact_name: body.contactName,
    contact_email: body.contactEmail,
    company: body.company,
    phone: body.phone ?? '',
    po_number: body.poNumber ?? '',
    delivery_line1: body.deliveryLine1,
    delivery_line2: body.deliveryLine2 ?? '',
    delivery_city: body.deliveryCity,
    delivery_postcode: body.deliveryPostcode,
    notes: body.notes ?? '',
    subtotal: body.subtotal,
    vat: body.vat,
    grand_total: body.grandTotal,
    status: 'pending',
    created_at: now,
    updated_at: now,
  });

  if (orderError) {
    return NextResponse.json({ error: orderError.message }, { status: 500 });
  }

  if (body.items.length > 0) {
    const { error: itemsError } = await supabase.from('order_items').insert(
      body.items.map((item) => ({
        order_id: orderId,
        category_id: item.categoryId,
        category_name: item.categoryName,
        proof_id: item.proofId,
        proof_name: item.proofName,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total: item.total,
      }))
    );

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ order: { id: orderId, createdAt: now } });
}

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
