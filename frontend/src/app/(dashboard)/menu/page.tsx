import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';

export default function MenuPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Menu Management</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Products & Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Menu management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

