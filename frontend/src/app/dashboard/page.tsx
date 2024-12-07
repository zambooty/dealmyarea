'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Button } from '@nextui-org/react';
import { useAuth } from '@/lib/hooks/useAuth';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardBody>
          <h1 className="text-2xl font-bold mb-2">Welcome to Your Dashboard</h1>
          <p className="text-default-500">
            {user?.email}
          </p>
          <Button
            color="primary"
            variant="flat"
            onPress={signOut}
            className="mt-4"
          >
            Sign Out
          </Button>
        </CardBody>
      </Card>
    </div>
  );
} 