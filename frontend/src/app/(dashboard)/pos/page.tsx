'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/stores/slices/cartStore';
import { toast } from 'sonner';
import { Search, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';

// Mock products for MVP
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Coffee - Espresso',
    description: 'Single shot espresso',
    price: 2.99,
    category: 'Beverages',
    stock: 100,
    sku: 'COF-ESP-001',
  },
  {
    id: '2',
    name: 'Coffee - Latte',
    description: 'Milk coffee',
    price: 4.99,
    category: 'Beverages',
    stock: 100,
    sku: 'COF-LAT-001',
  },
  {
    id: '3',
    name: 'Croissant',
    description: 'Fresh butter croissant',
    price: 3.49,
    category: 'Pastries',
    stock: 50,
    sku: 'PAS-CRO-001',
  },
  {
    id: '4',
    name: 'Sandwich - Ham & Cheese',
    description: 'Fresh sandwich with ham and cheese',
    price: 6.99,
    category: 'Food',
    stock: 30,
    sku: 'FOO-SAN-001',
  },
  {
    id: '5',
    name: 'Muffin - Blueberry',
    description: 'Homemade blueberry muffin',
    price: 2.99,
    category: 'Pastries',
    stock: 40,
    sku: 'PAS-MUF-001',
  },
  {
    id: '6',
    name: 'Juice - Orange',
    description: 'Fresh orange juice',
    price: 3.99,
    category: 'Beverages',
    stock: 60,
    sku: 'BEV-JUI-001',
  },
];

export default function POSPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { items, subtotal, tax, total, addItem, updateQuantity, removeItem, clearCart } =
    useCartStore();

  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    toast.success(`Order placed! Total: $${total.toFixed(2)}`);
    clearCart();
  };

  return (
    <div className="flex h-screen">
      {/* Products Grid */}
      <div className="flex-1 flex flex-col p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Point of Sale</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 overflow-y-auto">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => addItem(product)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <Badge variant="outline" className="w-fit">
                  {product.category}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                  <Button size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-96 border-l bg-gray-50 flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="text-xl font-bold">Current Order</h2>
          </div>
          <p className="text-sm text-gray-600">{items.length} items</p>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <ShoppingBag className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <Card key={item.product.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">${item.product.price.toFixed(2)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="font-bold">${item.subtotal.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Cart Summary */}
        <div className="border-t p-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="space-y-2 pt-2">
            <Button className="w-full" size="lg" onClick={handleCheckout} disabled={items.length === 0}>
              Complete Order
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={clearCart}
              disabled={items.length === 0}
            >
              Clear Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

