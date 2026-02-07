import Link from 'next/link';

export default function LoginPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Log In</h1>

      <div className="mb-6 rounded border border-gray-200 bg-gray-50 p-4">
        {/* LoginForm goes here - wired in Plan 03 */}
        <p className="text-sm text-gray-500">Login form will be added in Plan 03</p>
      </div>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
          Sign up
        </Link>
      </p>
    </div>
  );
}
