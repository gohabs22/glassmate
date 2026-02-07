import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-lg text-gray-600">Welcome!</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/dashboard/glasses"
          className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Manage My Glasses
          </h2>
          <p className="text-sm text-gray-600">
            Add, edit, and organize your glassware collection
          </p>
        </Link>

        <Link
          href="/scan"
          className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Check In Somewhere
          </h2>
          <p className="text-sm text-gray-600">
            Scan a QR code to see a host's glass collection
          </p>
        </Link>
      </div>

      <div className="mt-8">
        {/* Logout button - wired in Plan 03 */}
        <div className="inline-block rounded bg-gray-200 px-4 py-2 text-sm text-gray-500">
          Logout (wired in Plan 03)
        </div>
      </div>
    </div>
  );
}
