'use client';

import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSession } from '../../hooks/useSession';

export const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const { timeUntilExpiry } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  const formatTimeRemaining = (ms: number | null): string => {
    if (!ms) return '';
    const minutes = Math.floor(ms / 60000);
    return minutes > 0 ? `${minutes}m remaining` : 'Expiring soon';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
      >
        <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span>{user.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="p-4 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            {timeUntilExpiry !== null && (
              <p className="text-xs text-gray-400 mt-1">
                {formatTimeRemaining(timeUntilExpiry)}
              </p>
            )}
          </div>
          
          <div className="py-1">
            <button
              onClick={() => setIsOpen(false)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Profile Settings
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};