'use client';

import React from 'react';
import AuthGuard from '@/components/AuthGuard';
import Dashboard from '@/components/Dashboard';

export default function HomePage() {
  return (
    <AuthGuard requireAuth={true}>
      <Dashboard />
    </AuthGuard>
  );
}
