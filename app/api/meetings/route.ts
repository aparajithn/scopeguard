import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { transcribeAudio, analyzeMeeting } from '@/lib/openai';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const project_id = formData.get('project_id') as string;
  const title = formData.get('title') as string;
  const transcript_text = formData.get('transcript') as string | null;
  const audio_file = formData.get('audio') as File | null;

  if (!project_id) {
    return NextResponse.json({ error: 'Missing project_id' }, { status: 400 });
  }

  // Verify user owns this project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', project_id)
    .eq('user_id', user.id)
    .single();

  if (projectError || !project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  let transcript = transcript_text;

  // Transcribe audio if provided
  if (audio_file && !transcript_text) {
    const audioBuffer = Buffer.from(await audio_file.arrayBuffer());
    transcript = await transcribeAudio(audioBuffer);
  }

  if (!transcript) {
    return NextResponse.json({ error: 'No transcript or audio provided' }, { status: 400 });
  }

  // Create meeting record
  const { data: meeting, error: meetingError } = await supabase
    .from('meetings')
    .insert({
      project_id,
      title: title || 'Untitled Meeting',
      transcript
    })
    .select()
    .single();

  if (meetingError) {
    return NextResponse.json({ error: meetingError.message }, { status: 500 });
  }

  // Analyze for scope creep
  if (project.scope_summary) {
    const alerts = await analyzeMeeting(transcript, project.scope_summary);

    if (alerts.length > 0) {
      const alertsToInsert = alerts.map((alert: any) => ({
        meeting_id: meeting.id,
        request_text: alert.request_text,
        reason: alert.reason,
        contract_reference: alert.contract_reference || null
      }));

      await supabase.from('scope_alerts').insert(alertsToInsert);
    }

    // Mark as analyzed
    await supabase
      .from('meetings')
      .update({ analyzed_at: new Date().toISOString() })
      .eq('id', meeting.id);
  }

  return NextResponse.json({ meeting });
}
