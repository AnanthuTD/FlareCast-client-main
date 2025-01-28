'use client'

import { useSearchParams, useRouter } from 'next/navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-screen bg-green-50">
      <div className="bg-white p-8 shadow-lg rounded-lg text-center max-w-md">
        <h1 className="text-2xl font-bold text-green-600">Verification Successful!</h1>
        <p className="text-gray-700 mt-4">{message || "Your email has been successfully verified."}</p>
        <button
          className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          onClick={() => router.push('/signin')}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
