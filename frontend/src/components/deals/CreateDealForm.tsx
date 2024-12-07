'use client';

import { useState } from 'react';
import { Button, Input, Textarea, Select, SelectItem, Card, CardBody } from '@nextui-org/react';
import { dealService } from '@/lib/services/dealService';

const categories = [
  'Groceries',
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Beauty',
  'Sports',
  'Other',
];

interface CreateDealFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateDealForm({ onSuccess, onCancel }: CreateDealFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    store_name: '',
    category: '',
    location: {
      lat: '',
      lng: '',
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await dealService.createDeal({
        ...formData,
        price: parseFloat(formData.price),
        location: {
          lat: parseFloat(formData.location.lat),
          lng: parseFloat(formData.location.lng),
        },
      });
      onSuccess?.();
    } catch (err) {
      setError('Failed to create deal');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    if (field.startsWith('location.')) {
      const locationField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={e => handleChange('title', e.target.value)}
            required
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={e => handleChange('description', e.target.value)}
            required
          />

          <Input
            type="number"
            label="Price"
            value={formData.price}
            onChange={e => handleChange('price', e.target.value)}
            required
          />

          <Input
            label="Store Name"
            value={formData.store_name}
            onChange={e => handleChange('store_name', e.target.value)}
            required
          />

          <Select
            label="Category"
            value={formData.category}
            onChange={e => handleChange('category', e.target.value)}
            required
          >
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Latitude"
              value={formData.location.lat}
              onChange={e => handleChange('location.lat', e.target.value)}
              required
            />
            <Input
              type="number"
              label="Longitude"
              value={formData.location.lng}
              onChange={e => handleChange('location.lng', e.target.value)}
              required
            />
          </div>

          {error && <p className="text-danger text-small">{error}</p>}

          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button color="default" variant="light" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button color="primary" type="submit" isLoading={loading}>
              Create Deal
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
} 