'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, CardFooter, Input, Select, SelectItem, Button, Spinner, Modal, ModalContent, Chip } from '@nextui-org/react';
import { dealService, type Deal, type DealFilters } from '@/lib/services/dealService';
import { CreateDealForm } from '@/components/deals/CreateDealForm';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';

const categories = [
  'Groceries',
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Beauty',
  'Sports',
  'Other',
];

export default function DealsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState<DealFilters>({
    sort_by: 'created_at',
    sort_order: 'desc',
  });

  useEffect(() => {
    loadDeals();
  }, [filters]);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const data = await dealService.getDeals(filters);
      setDeals(data);
      setError('');
    } catch (err) {
      setError('Failed to load deals');
      console.error('Error details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof DealFilters, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value,
    }));
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    loadDeals();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleDealClick = (dealId: string) => {
    router.push(`/deals/${dealId}`);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Deals</h1>
              <p className="text-gray-500 dark:text-gray-400">Find the best deals in your area</p>
            </div>
            {user && (
              <Button 
                color="primary"
                variant="shadow"
                onPress={() => setIsCreateModalOpen(true)}
                className="w-full md:w-auto"
              >
                + Add New Deal
              </Button>
            )}
          </div>

          {/* Filters Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Category"
              placeholder="Select category"
              value={filters.category}
              onChange={e => handleFilterChange('category', e.target.value)}
              className="w-full"
            >
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </Select>

            <Input
              type="number"
              label="Min Price"
              placeholder="0"
              value={filters.min_price?.toString() || ''}
              onChange={e => handleFilterChange('min_price', parseFloat(e.target.value))}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">$</span>
                </div>
              }
            />

            <Input
              type="number"
              label="Max Price"
              placeholder="1000"
              value={filters.max_price?.toString() || ''}
              onChange={e => handleFilterChange('max_price', parseFloat(e.target.value))}
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">$</span>
                </div>
              }
            />

            <Select
              label="Sort By"
              value={filters.sort_by}
              onChange={e => handleFilterChange('sort_by', e.target.value)}
            >
              <SelectItem key="created_at" value="created_at">Newest First</SelectItem>
              <SelectItem key="price" value="price">Price</SelectItem>
            </Select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-danger-50 text-danger p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Spinner size="lg" />
          </div>
        ) : deals.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
            <p className="text-xl text-gray-500 dark:text-gray-400">
              No deals found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          /* Deals Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map(deal => (
              <Card 
                key={deal.id} 
                className="hover:shadow-lg transition-all cursor-pointer"
                isPressable
                onPress={() => handleDealClick(deal.id)}
              >
                <CardHeader className="flex flex-col items-start gap-2 pb-0">
                  <div className="flex justify-between w-full items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold line-clamp-2">{deal.title}</h3>
                      <p className="text-small text-default-500">{deal.store_name}</p>
                    </div>
                    <Chip
                      className="ml-2"
                      color="success"
                      variant="flat"
                      size="sm"
                    >
                      ${deal.price.toFixed(2)}
                    </Chip>
                  </div>
                </CardHeader>
                <CardBody className="py-2">
                  <p className="text-default-500 line-clamp-2">{deal.description}</p>
                </CardBody>
                <CardFooter className="flex justify-between items-center pt-0">
                  <Chip size="sm" variant="flat" color="primary">
                    {deal.category}
                  </Chip>
                  <span className="text-tiny text-default-400">
                    {formatDate(deal.created_at)}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Create Deal Modal */}
        <Modal 
          isOpen={isCreateModalOpen} 
          onOpenChange={setIsCreateModalOpen}
          size="2xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            {() => (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Create New Deal</h2>
                <CreateDealForm 
                  onSuccess={handleCreateSuccess}
                  onCancel={() => setIsCreateModalOpen(false)}
                />
              </div>
            )}
          </ModalContent>
        </Modal>
      </div>
    </main>
  );
} 