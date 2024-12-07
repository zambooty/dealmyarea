'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Button, Spinner, Chip } from '@nextui-org/react';
import { dealService, type Deal } from '@/lib/services/dealService';
import { useAuth } from '@/lib/auth/AuthContext';

export default function DealDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDeal();
  }, [params.id]);

  const loadDeal = async () => {
    try {
      setLoading(true);
      const data = await dealService.getDeal(params.id);
      setDeal(data);
      setError('');
    } catch (err) {
      setError('Failed to load deal');
      console.error('Error details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this deal?')) return;
    
    try {
      await dealService.deleteDeal(params.id);
      router.push('/deals');
    } catch (err) {
      setError('Failed to delete deal');
      console.error('Error details:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardBody>
            <p className="text-danger text-center">{error || 'Deal not found'}</p>
            <Button
              color="primary"
              variant="light"
              onPress={() => router.push('/deals')}
              className="mt-4 mx-auto"
            >
              Back to Deals
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardBody className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">{deal.title}</h1>
                  <Chip color="success" variant="flat">
                    ${deal.price.toFixed(2)}
                  </Chip>
                </div>
                <p className="text-default-500">{deal.store_name}</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Button
                  color="primary"
                  variant="light"
                  onPress={() => router.push('/deals')}
                  className="flex-1 md:flex-none"
                >
                  Back to Deals
                </Button>
                {user && (
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={handleDelete}
                    className="flex-1 md:flex-none"
                  >
                    Delete Deal
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-default-600">{deal.description}</p>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-2">Details</h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-default-500">Category:</span>
                    <Chip size="sm" variant="flat" color="primary">
                      {deal.category}
                    </Chip>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-default-500">Posted:</span>
                    <span>{formatDate(deal.created_at)}</span>
                  </div>
                  {deal.expires_at && (
                    <div className="flex items-center gap-2">
                      <span className="text-default-500">Expires:</span>
                      <span>{formatDate(deal.expires_at)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Location</h2>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-default-600">
                  Latitude: {deal.location.lat}, Longitude: {deal.location.lng}
                </p>
                {/* TODO: Add Google Maps integration */}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </main>
  );
} 