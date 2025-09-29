'use client';

import React from 'react';
import { AuthGuard } from '../../features/auth/presentation/components/AuthGuard/AuthGuard';
import { UserMenu } from '../../features/auth/presentation/components/UserMenu/UserMenu';
import { useAuth } from '../../features/auth/presentation/hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-semibold text-gray-900">
                Dashboard
              </h1>
              <UserMenu />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome back, {user?.name}!
                </h2>
                <p className="text-gray-600">
                  Your dashboard is ready.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}