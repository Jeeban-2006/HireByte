"use client";

import { AuthProvider } from '@/context/auth-context';
import { ReactNode } from 'react';

interface ClientAuthProviderProps {
  children: ReactNode;
}

export function ClientAuthProvider({ children }: ClientAuthProviderProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
