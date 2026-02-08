import Link from 'next/link';

/**
 * 404 page for invalid check-in codes
 * Handles Next.js notFound() fallback
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Invalid Check-in Code
        </h1>
        <p className="mb-8 text-gray-600">
          This QR code is invalid or has expired. Please ask your host for a new code.
        </p>
        <Link
          href="/signup"
          className="inline-block rounded-md bg-amber-600 px-6 py-3 text-base font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          Create Your Own Collection
        </Link>
      </div>
    </div>
  );
}
