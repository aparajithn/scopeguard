import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    redirect('/login');
  }

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const { data: alerts } = await supabase
    .from('scope_alerts')
    .select(`
      *,
      meetings!inner(
        id,
        title,
        projects!inner(
          id,
          name,
          user_id
        )
      )
    `)
    .eq('meetings.projects.user_id', user.id)
    .eq('status', 'new')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">ScopeGuard</h1>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Your Projects</h2>
            <Link
              href="/dashboard/projects/new"
              className="rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700"
            >
              + New Project
            </Link>
          </div>

          {projects && projects.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
                  <p className="text-sm text-gray-600">
                    Created {new Date(project.created_at).toLocaleDateString()}
                  </p>
                  {project.scope_summary && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ Scope analyzed
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-600 mb-4">No projects yet</p>
              <Link
                href="/dashboard/projects/new"
                className="inline-block rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700"
              >
                Create your first project
              </Link>
            </div>
          )}
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Alerts
              {alerts && alerts.length > 0 && (
                <span className="ml-2 inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                  {alerts.length} new
                </span>
              )}
            </h2>
            <Link href="/dashboard/alerts" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>

          {alerts && alerts.length > 0 ? (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-red-600">🚨 Scope Creep</span>
                    <span className="text-xs text-gray-500">
                      {new Date(alert.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900">"{alert.request_text}"</p>
                  <p className="text-sm text-gray-600 mt-1">{alert.reason}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg">
              <p className="text-gray-600">No scope creep detected - you're all clear! ✅</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
