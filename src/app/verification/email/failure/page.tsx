'use client'

import { useSearchParams, useRouter } from 'next/navigation';

export default function FailurePage() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen bg-red-50">
      <div className="bg-white p-8 shadow-lg rounded-lg text-center max-w-md">
        <h1 className="text-2xl font-bold text-red-600">Verification Failed</h1>
        <p className="text-gray-700 mt-4">{message || "We couldn't verify your email. Please try again later."}</p>
        <button
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          onClick={() => router.push('/')}
        >
          Resend Verification Email
        </button>
      </div>
    </div>
  );
}
