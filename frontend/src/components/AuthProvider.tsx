"use client";

import { useEffect } from 'react';
import {useRouter} from 'next/navigation';
import useAuthStore from '@/store/authStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (typeof window !== 'undefined' && !isAuthenticated && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')  && !window.location.pathname.startsWith('/')) {

    return null;
  }

  return <>{children}</>;
}