'use client';
import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
import {
  SessionProvider,
  SessionProviderProps,
  signOut
} from 'next-auth/react';
import { SWRConfig } from 'swr';
import { fetcher } from '@/services/fetcher';
import { signOut as actionSignOut } from '@/services/auth/signOut';
import { useRouter } from 'next/navigation';
export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <>
      <SWRConfig
        value={{
          fetcher,
          onSuccess: (data, key, config) => {
            console.log('Data fetched successfully:', data);
          },
          onError: async (error) => {
            const errorMessage = error.message || '';

            const isUnauthorized =
              errorMessage.includes('Unauthorized') ||
              error.response?.status === 401;

            if (isUnauthorized) {
              console.warn('⚠️ Session expired, logging out...');
              await actionSignOut();
              router.push('/');
            } else {
              console.error('Error fetching data:', error);
            }
          }
        }}
      >
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          {children}
        </ThemeProvider>
      </SWRConfig>
    </>
  );
}
