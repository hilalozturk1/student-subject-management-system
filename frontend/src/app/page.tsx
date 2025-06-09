"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && typeof window !== 'undefined') {
      router.push('/dashboard/students');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-700">Welcome</h1>
        <p className="text-lg text-center mb-8 text-gray-600">
          Login or Register
        </p>
        <div className="flex gap-4 w-full">
          <button
            onClick={() => router.push("/login")}
            className="flex-1 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/register")}
            className="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-800 text-white font-semibold transition"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}