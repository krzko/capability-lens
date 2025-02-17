import { Metadata } from 'next';
import SignInForm from './SignInForm';

export const metadata: Metadata = {
  title: 'Sign In - Capability Lens',
  description: 'Sign in to your account',
};

export default function SignIn() {
  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
