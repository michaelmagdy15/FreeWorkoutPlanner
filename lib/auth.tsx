'use client';

import React from 'react';
import { 
  ClerkProvider as RealClerkProvider, 
  useUser as useRealUser,
  Show as RealShow,
  SignInButton as RealSignInButton,
  SignOutButton as RealSignOutButton,
  UserButton as RealUserButton
} from '@clerk/nextjs';

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const isMock = !clerkKey || clerkKey === 'your_clerk_publishable_key_here' || (clerkKey && clerkKey.includes('mock-clerk'));

export function ClerkProvider({ children, publishableKey }: { children: React.ReactNode; publishableKey?: string }) {
  if (isMock) {
    return <>{children}</>;
  }
  return <RealClerkProvider publishableKey={publishableKey}>{children}</RealClerkProvider>;
}

export function useUser() {
  if (isMock) {
    return {
      isSignedIn: false,
      user: null,
      isLoaded: true,
    };
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useRealUser();
}

export function Show({ when, children }: { when: 'signed-in' | 'signed-out'; children: React.ReactNode }) {
  if (isMock) {
    if (when === 'signed-out') {
      return <>{children}</>;
    }
    return null;
  }
  return <RealShow when={when}>{children}</RealShow>;
}

export function SignInButton({ children, mode }: { children: React.ReactNode; mode?: 'modal' | 'redirect' }) {
  if (isMock) {
    return <>{children}</>;
  }
  return <RealSignInButton mode={mode}>{children}</RealSignInButton>;
}

export function SignOutButton({ children }: { children: React.ReactNode }) {
  if (isMock) {
    return <>{children}</>;
  }
  return <RealSignOutButton>{children}</RealSignOutButton>;
}

export function UserButton() {
  if (isMock) {
    return null;
  }
  return <RealUserButton />;
}
