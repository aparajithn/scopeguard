import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import ScopeAlert from '@/components/ScopeAlert';

export default async function AlertsPage() {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    redirect('/login');
  }

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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          All Scope Alerts
        </h1>

        {alerts && alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id}>
                <div className="text-sm text-gray-600 mb-2">
                  Project: {(alert.meetings as any)?.projects?.name}
                </div>
                <ScopeAlert
                  alert={alert}
                  meetingTitle={(alert.meetings as any)?.title}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg">No scope alerts yet - you're all clear! ✅</p>
          </div>
        )}
      </main>
    </div>
  );
}
