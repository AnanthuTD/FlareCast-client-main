"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";

export default function FailurePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-6">
          Something went wrong with your payment. Please try again or contact support if the issue persists.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => router.push("/pricing")}
            className="w-full px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/support")}
            className="w-full px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}