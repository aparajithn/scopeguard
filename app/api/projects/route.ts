import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { extractScope } from '@/lib/openai';

export async function GET() {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { name, contract_text } = body;

  if (!name || !contract_text) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Extract scope using AI
  const scope_summary = await extractScope(contract_text);

  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      name,
      contract_text,
      scope_summary
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ project });
}
