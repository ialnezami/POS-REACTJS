import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics & Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Analytics and reporting features coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}

