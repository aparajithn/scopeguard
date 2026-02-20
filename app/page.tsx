import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">ScopeGuard</h1>
            <div className="space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Stop losing $1-5K/month to scope creep you didn't catch.
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            ScopeGuard analyzes your client meetings and alerts you the moment they request 
            something outside your contract — before you waste hours building it.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-md bg-blue-600 px-8 py-3 text-lg font-medium text-white hover:bg-blue-700"
            >
              Try Free for 14 Days
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-gray-300 bg-white px-8 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              Sign In
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">No credit card required</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-lg shadow">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload your contract</h3>
            <p className="text-gray-600">We extract what's in scope using AI</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow">
            <div className="text-4xl mb-4">🎙️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect your meetings</h3>
            <p className="text-gray-600">Zoom, Google Meet, or upload transcripts</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow">
            <div className="text-4xl mb-4">🚨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Get instant alerts</h3>
            <p className="text-gray-600">AI flags out-of-scope requests with draft responses</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Features</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="text-green-500 text-2xl mr-4">✅</div>
              <div>
                <h3 className="font-semibold text-gray-900">Real-time scope detection</h3>
                <p className="text-gray-600">Catch creep as it happens in calls</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-green-500 text-2xl mr-4">✅</div>
              <div>
                <h3 className="font-semibold text-gray-900">Contract-backed alerts</h3>
                <p className="text-gray-600">Every flag includes the specific clause it violates</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-green-500 text-2xl mr-4">✅</div>
              <div>
                <h3 className="font-semibold text-gray-900">Draft responses</h3>
                <p className="text-gray-600">Professional templates to send clients immediately</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center bg-blue-600 text-white rounded-lg shadow-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to protect your scope?</h2>
          <p className="text-xl mb-8">Join freelancers saving thousands every month</p>
          <Link
            href="/signup"
            className="inline-block rounded-md bg-white px-8 py-3 text-lg font-medium text-blue-600 hover:bg-gray-100"
          >
            Start Free Trial
          </Link>
        </div>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            © 2026 ScopeGuard. Built with Next.js, Supabase, and OpenAI.
          </p>
        </div>
      </footer>
    </div>
  );
}
