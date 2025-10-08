// User types
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  TENANT_ADMIN = 'tenant_admin',
  STORE_MANAGER = 'store_manager',
  CASHIER = 'cashier',
  INVENTORY_MANAGER = 'inventory_manager',
  ACCOUNTANT = 'accountant',
  VIEWER = 'viewer',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantId: string;
  storeId?: string;
  isActive: boolean;
  lastLogin?: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
  tenantId?: string; // Optional - will auto-detect user's tenant if not provided
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  businessName: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
  stock: number;
  sku: string;
}

// Cart types
export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

// Order types
export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}


