"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function PaymentFailed() {
  const router = useRouter();

  useEffect(() => {
    toast.error('Payment failed. Please try again.');
    // Redirect to orders page after 3 seconds
    setTimeout(() => {
      router.push('/orders');
    }, 3000);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Failed</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          We couldn't process your payment. Please try again.
        </p>
        <button
          onClick={() => router.push('/orders')}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Return to Orders
        </button>
      </div>
    </div>
  );
}