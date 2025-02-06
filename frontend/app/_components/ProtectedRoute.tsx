'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get('accessToken');
      
      if (!token) {
        router.push('/pages/logini');
        return;
      }

      try {
        const decoded = jwtDecode(token) as DecodedToken;
        if (decoded.exp * 1000 < Date.now()) {
          Cookies.remove('accessToken');
          router.push('/pages/logini');
          return;
        }
      } catch (error) {
        Cookies.remove('accessToken');
        router.push('/pages/logini');
        return;
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return <>{children}</>;
} 