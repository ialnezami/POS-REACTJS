import { apiClient } from './client';

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  _id: string;
  saleNumber: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  paymentMethod: 'cash' | 'card' | 'mobile' | 'other';
  customerName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSaleDto {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  paymentMethod: 'cash' | 'card' | 'mobile' | 'other';
  discount?: number;
  customerName?: string;
  notes?: string;
}

export const salesApi = {
  getAll: async (startDate?: string, endDate?: string, status?: string): Promise<Sale[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (status) params.append('status', status);
    const response = await apiClient.get(`/sales?${params.toString()}`);
    return response.data;
  },

  getOne: async (id: string): Promise<Sale> => {
    const response = await apiClient.get(`/sales/${id}`);
    return response.data;
  },

  create: async (data: CreateSaleDto): Promise<Sale> => {
    const response = await apiClient.post('/sales', data);
    return response.data;
  },

  cancel: async (id: string): Promise<Sale> => {
    const response = await apiClient.patch(`/sales/${id}/cancel`);
    return response.data;
  },

  getDailySummary: async (date?: string): Promise<any> => {
    const params = date ? `?date=${date}` : '';
    const response = await apiClient.get(`/sales/daily-summary${params}`);
    return response.data;
  },
};

