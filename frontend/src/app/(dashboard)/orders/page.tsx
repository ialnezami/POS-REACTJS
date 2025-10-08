import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Order History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Order history and management features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

