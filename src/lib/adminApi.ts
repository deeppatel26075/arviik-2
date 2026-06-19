import { supabase } from './supabase';

export async function adminDbQuery(
  table: string,
  operation: 'insert' | 'update' | 'delete' | 'upsert',
  data?: any,
  match?: any,
  upsertOptions?: any
) {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  
  if (!token) {
    throw new Error('No active login session. Please sign in as admin.');
  }
  
  const response = await fetch('/api/admin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      table,
      operation,
      data,
      match,
      upsertOptions
    })
  });
  
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Database operation failed');
  }
  
  return result;
}
