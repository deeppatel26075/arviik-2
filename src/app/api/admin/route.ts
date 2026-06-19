import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
  try {
    // 1. Verify that the request comes from an authenticated Admin
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    
    // Get user from auth token
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    
    // Check user role in profiles
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin role required' }, { status: 403 });
    }
    
    // 2. Parse query parameters
    const body = await request.json();
    const { table, operation, data, match, upsertOptions } = body;
    
    if (!table || !operation) {
      return NextResponse.json({ error: 'Missing table or operation parameter' }, { status: 400 });
    }
    
    // Allowed tables to prevent arbitrary writes to other tables
    const allowedTables = ['products', 'categories', 'product_images', 'inventory', 'coupons', 'orders', 'site_settings', 'profiles'];
    if (!allowedTables.includes(table)) {
      return NextResponse.json({ error: `Forbidden: Table '${table}' is not queryable` }, { status: 403 });
    }
    
    let queryResult;
    let queryError;
    
    // 3. Execute database operation using supabaseAdmin
    if (operation === 'insert') {
      const { data: resData, error: err } = await supabaseAdmin
        .from(table)
        .insert(data)
        .select();
      queryResult = resData;
      queryError = err;
    } else if (operation === 'update') {
      let q = supabaseAdmin.from(table).update(data);
      if (match) {
        Object.keys(match).forEach(key => {
          q = q.eq(key, match[key]);
        });
      }
      const { data: resData, error: err } = await q.select();
      queryResult = resData;
      queryError = err;
    } else if (operation === 'delete') {
      let q = supabaseAdmin.from(table).delete();
      if (match) {
        Object.keys(match).forEach(key => {
          q = q.eq(key, match[key]);
        });
      }
      const { data: resData, error: err } = await q.select();
      queryResult = resData;
      queryError = err;
    } else if (operation === 'upsert') {
      const { data: resData, error: err } = await supabaseAdmin
        .from(table)
        .upsert(data, upsertOptions)
        .select();
      queryResult = resData;
      queryError = err;
    } else {
      return NextResponse.json({ error: `Invalid operation '${operation}'` }, { status: 400 });
    }
    
    if (queryError) {
      console.error(`Postgres execution error on table ${table}:`, queryError);
      return NextResponse.json({ error: queryError.message, code: queryError.code }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, data: queryResult });
  } catch (error: any) {
    console.error('Error in POST /api/admin:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
