"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import CustomButton from '@/components/CustomButton';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && typeof window !== 'undefined') {
      router.push('/dashboard/students');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4">
      <h1 className="text-4xl font-bold mb-6 text-blue-600">Welcome</h1>
      <p className="text-lg text-center mb-8 max-w-xl">
        Login or Register
      </p>
      <div className="flex space-x-4">
        <CustomButton href="/login" type="link" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md">
          Login
        </CustomButton>
        <CustomButton href="/register" type="link" className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-6 rounded-md">
          Register
        </CustomButton>
      </div>
    </div>
  );
}
