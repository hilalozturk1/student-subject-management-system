"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import CustomButton from '@/components/CustomButton';
import Cookies from 'js-cookie';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const userName = Cookies.get("user");
  const is_staff = Cookies.get("is_staff")
  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Student & Course Management</h1>
        <nav className="flex items-center space-x-4">
          {user?.is_staff && (// Link for only admin role
            <CustomButton type="link" href="/dashboard/students" className="text-white">
              Students
            </CustomButton>
          )}
          <CustomButton type="link" href="/dashboard/courses" className="text-white">
            Courses
          </CustomButton>
          <CustomButton type="link" href="/dashboard/enrollments" className="text-white">
            Enrollments
          </CustomButton>
          <span className="text-sm">Welcome, {userName} ({is_staff ? 'Admin' : 'Student'})</span>
          <CustomButton onClick={logout} className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md">
            Log out
          </CustomButton>
        </nav>
      </header>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}