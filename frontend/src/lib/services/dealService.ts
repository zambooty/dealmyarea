const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Deal {
  id: string;
  title: string;
  description: string;
  price: number;
  store_name: string;
  location: {
    lat: number;
    lng: number;
  };
  created_at: string;
  expires_at?: string;
  category: string;
  image_url?: string;
}

export interface DealFilters {
  category?: string;
  store?: string;
  min_price?: number;
  max_price?: number;
  lat?: number;
  lng?: number;
  radius?: number;
  sort_by?: string;
  sort_order?: string;
}

export const dealService = {
  async getDeals(filters: DealFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    try {
      console.log('Making request to:', `${API_URL}/deals?${params.toString()}`);
      const response = await fetch(`${API_URL}/deals?${params.toString()}`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error(`Failed to fetch deals: ${response.status} ${errorData}`);
      }
      
      const data = await response.json();
      return data as Deal[];
    } catch (error) {
      console.error('Error fetching deals:', error);
      throw error;
    }
  },

  async getDeal(id: string) {
    try {
      const response = await fetch(`${API_URL}/deals/${id}`);
      if (!response.ok) throw new Error('Failed to fetch deal');
      return await response.json() as Deal;
    } catch (error) {
      console.error('Error fetching deal:', error);
      throw error;
    }
  },

  async createDeal(deal: Omit<Deal, 'id' | 'created_at'>) {
    try {
      const response = await fetch(`${API_URL}/deals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deal),
      });
      if (!response.ok) throw new Error('Failed to create deal');
      return await response.json() as Deal;
    } catch (error) {
      console.error('Error creating deal:', error);
      throw error;
    }
  },

  async deleteDeal(id: string) {
    try {
      const response = await fetch(`${API_URL}/deals/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete deal');
      return await response.json();
    } catch (error) {
      console.error('Error deleting deal:', error);
      throw error;
    }
  },
}; 