import Link from 'next/link';
import { SignupForm } from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Create Account</h1>

      <div className="mb-6">
        <SignupForm />
      </div>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
          Log in
        </Link>
      </p>
    </div>
  );
}
