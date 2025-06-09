"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import Cookies from 'js-cookie';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const userName = Cookies.get("user");
  const is_staff = Cookies.get("is_staff") === "true";

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white flex items-center justify-between px-8 py-4 shadow">
        <div className="text-xl font-normal">Student & Course Management</div>
        <nav className="flex gap-6">
          <a href="/dashboard/students" className="hover:underline">Students</a>
          <a href="/dashboard/courses" className="hover:underline">Courses</a>
          <a href="/dashboard/enrollments" className="hover:underline">Enrollments</a>
        </nav>
        <div className="flex items-center gap-4">
          <span className="text-sm">{userName} ({is_staff ? 'Admin' : 'Student'})</span>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
          >
            Log out
          </button>
        </div>
      </header>
      <main className="p-8">{children}</main>
    </div>
  );
}