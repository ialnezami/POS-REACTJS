import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function CustomersPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Customers</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Customer management and CRM features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

