// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useInstagramAuth } from '@/hooks/use-instagram';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useInstagramAuth();
  
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/profile');
      } else {
        router.push('/login');
      }
    }
  }, [isLoading, isAuthenticated, router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-xl">Loading...</p>
    </div>
  );
}