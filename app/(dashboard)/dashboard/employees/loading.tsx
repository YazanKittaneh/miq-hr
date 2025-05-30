import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ActivityPageSkeleton() {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-gray-900 mb-6">
        Employee List
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>All Employees</CardTitle>
        </CardHeader>
        <CardContent className="min-h-[88px]" />
      </Card>
    </section>
  );
}
