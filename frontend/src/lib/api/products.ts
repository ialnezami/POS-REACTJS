import { apiClient } from './client';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  sku: string;
  imageUrl?: string;
  barcode?: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  cost?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  sku: string;
  imageUrl?: string;
  barcode?: string;
  cost?: number;
  tags?: string[];
}

export const productsApi = {
  getAll: async (status?: string, category?: string): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (category) params.append('category', category);
    const response = await apiClient.get(`/products?${params.toString()}`);
    return response.data;
  },

  getOne: async (id: string): Promise<Product> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  create: async (data: CreateProductDto): Promise<Product> => {
    const response = await apiClient.post('/products', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateProductDto>): Promise<Product> => {
    const response = await apiClient.patch(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  updateStock: async (id: string, quantity: number): Promise<Product> => {
    const response = await apiClient.patch(`/products/${id}/stock`, { quantity });
    return response.data;
  },

  search: async (query: string): Promise<Product[]> => {
    const response = await apiClient.get(`/products/search?q=${query}`);
    return response.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await apiClient.get('/products/categories');
    return response.data;
  },
};

