import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const project_id = searchParams.get('project_id');

  let query = supabase
    .from('scope_alerts')
    .select(`
      *,
      meetings!inner(
        id,
        title,
        created_at,
        projects!inner(
          id,
          name,
          user_id
        )
      )
    `)
    .eq('meetings.projects.user_id', user.id)
    .order('created_at', { ascending: false });

  if (project_id) {
    query = query.eq('meetings.project_id', project_id);
  }

  const { data: alerts, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ alerts });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, status } = body;

  if (!id || !status) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Update alert status
  const { data: alert, error } = await supabase
    .from('scope_alerts')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ alert });
}
