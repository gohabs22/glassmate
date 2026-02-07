import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Log In</h1>

      <div className="mb-6">
        <LoginForm />
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
