"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export default function PaymentSuccess() {
  const router = useRouter();

  const { data: orderData, isLoading } = useQuery({
    queryKey: ['payment-success'],
    queryFn: async () => {
      const response = await axios.get('/api/payment/status');
      return response.data;
    },
    retry: false
  });

  useEffect(() => {
    if (orderData?.status === 'PAID') {
      toast.success('Payment successful!');
      // Redirect to orders page after 3 seconds
      setTimeout(() => {
        router.push('/orders');
      }, 3000);
    }
  }, [orderData, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-lg">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Thank you for your purchase. Your order has been confirmed.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Order ID: {orderData?.orderId}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Amount: {orderData?.amount} تومان
        </p>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Redirecting to orders page...
        </p>
      </div>
    </div>
  );
}