'use client';

import React from 'react';
import { AuthProvider } from '../features/auth/presentation/components/AuthProvider/AuthProvider';
import { getAuthControllerDependencies } from '../config/auth.container';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authDependencies = getAuthControllerDependencies();

  return (
    <html lang="en">
      <body>
        <AuthProvider dependencies={authDependencies}>
          <div id="root">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}