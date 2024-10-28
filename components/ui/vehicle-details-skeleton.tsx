import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function VehicleDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-6 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Skeleton className="h-64 w-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Skeleton className="h-8 w-40 mb-4" />
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Skeleton className="h-8 w-40 mb-4" />
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Skeleton className="h-px w-full my-6" />

          <div>
            <Skeleton className="h-8 w-40 mb-2" />
            <Skeleton className="h-20 w-full" />
          </div>

          <Skeleton className="h-px w-full my-6" />

          <Skeleton className="h-4 w-40" />
        </CardContent>
      </Card>
    </div>
  );
}
