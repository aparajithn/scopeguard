import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import MeetingUpload from '@/components/MeetingUpload';
import ScopeAlert from '@/components/ScopeAlert';

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    redirect('/login');
  }

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (projectError || !project) {
    redirect('/dashboard');
  }

  const { data: meetings } = await supabase
    .from('meetings')
    .select('*')
    .eq('project_id', id)
    .order('created_at', { ascending: false });

  const { data: alerts } = await supabase
    .from('scope_alerts')
    .select(`
      *,
      meetings!inner(id, title)
    `)
    .in('meeting_id', meetings?.map(m => m.id) || [])
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
              ScopeGuard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">{project.name}</h1>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Scope</h2>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              {project.scope_summary ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Deliverables</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {project.scope_summary.deliverables?.map((item: string, i: number) => (
                        <li key={i} className="text-sm text-gray-700">{item}</li>
                      ))}
                    </ul>
                  </div>
                  {project.scope_summary.exclusions?.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Exclusions</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {project.scope_summary.exclusions.map((item: string, i: number) => (
                          <li key={i} className="text-sm text-gray-700">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {project.scope_summary.constraints?.length > 0 && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Constraints</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {project.scope_summary.constraints.map((item: string, i: number) => (
                          <li key={i} className="text-sm text-gray-700">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">No scope extracted yet</p>
              )}
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Meeting</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <MeetingUpload projectId={id} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Scope Alerts
              {alerts && alerts.length > 0 && (
                <span className="ml-2 inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                  {alerts.length}
                </span>
              )}
            </h2>
            {alerts && alerts.length > 0 ? (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <ScopeAlert
                    key={alert.id}
                    alert={alert}
                    meetingTitle={(alert.meetings as any)?.title}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-600">No scope creep detected yet ✅</p>
              </div>
            )}

            {meetings && meetings.length > 0 && (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 mt-8">Meeting History</h2>
                <div className="space-y-3">
                  {meetings.map((meeting) => (
                    <div key={meeting.id} className="bg-white rounded-lg shadow p-4">
                      <h3 className="font-medium text-gray-900">{meeting.title || 'Untitled'}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(meeting.created_at).toLocaleDateString()}
                      </p>
                      {meeting.analyzed_at && (
                        <p className="text-xs text-green-600 mt-1">✓ Analyzed</p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
