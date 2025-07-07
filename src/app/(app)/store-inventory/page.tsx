'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Package } from "lucide-react";

export default function StoreInventoryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Store Inventory</h1>
        <p className="text-muted-foreground">
          Manage and track store inventory items.
        </p>
      </div>
      <Card className="flex flex-col items-center justify-center h-96 border-dashed">
        <CardHeader className="text-center">
            <div className="mx-auto bg-muted p-4 rounded-full w-fit mb-4">
                <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <CardTitle>Inventory Page Under Construction</CardTitle>
            <CardDescription>This feature is coming soon. Stay tuned!</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
