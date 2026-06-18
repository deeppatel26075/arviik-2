import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const list = searchParams.get('list');

    // 1. Fetch all profiles (for admin customer directory)
    if (list === 'true') {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json(data);
    }

    // 2. Fetch single profile
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // If profile doesn't exist, return empty object/null cleanly
      if (error.code === 'PGRST116') {
        return NextResponse.json(null);
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in GET /api/profile:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve profile data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, full_name, phone, shipping_address, shipping_city, shipping_state, shipping_pincode } = body;

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id,
        full_name,
        phone,
        shipping_address,
        shipping_city,
        shipping_state,
        shipping_pincode,
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in POST /api/profile:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update profile data' },
      { status: 500 }
    );
  }
}
