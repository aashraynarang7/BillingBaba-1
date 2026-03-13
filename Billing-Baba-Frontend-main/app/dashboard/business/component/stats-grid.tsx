import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { Separator } from "@/components/ui/separator";
  import { FileText, Share2 } from "lucide-react";
  import Link from "next/link";
  
  // New component for the empty line graph placeholder
  const EmptyLineGraph = () => {
    const yAxisLabels = ['3', '2', '1', '0'];
    const xAxisLabels = ['Su', 'M', 'T', 'W', 'Th', 'F', 'S'];
  
    return (
      <div className="mt-4 w-full">
        <div className="flex items-start space-x-2">
          {/* Y-axis Labels */}
          <div className="flex h-24 flex-col justify-between text-right text-xs text-muted-foreground">
            {yAxisLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
  
          {/* Graph Area */}
          <div className="flex-1">
            {/* Horizontal Grid Lines */}
            <div className="relative h-24">
              {yAxisLabels.map((label, index) => (
                <div
                  key={label}
                  className={`absolute w-full border-b ${index === yAxisLabels.length - 1 ? 'border-gray-300' : 'border-dashed border-gray-200'}`}
                  style={{ bottom: `${(index / (yAxisLabels.length - 1)) * 100}%` }}
                />
              ))}
            </div>
            
            {/* X-axis Labels */}
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              {xAxisLabels.map((label) => (
                <span key={label} className="w-1/7 text-center">{label}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Component for the "No Open Orders" placeholder (no changes needed here)
  const NoOrdersPlaceholder = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
          <div className="p-5 bg-muted rounded-full">
              <FileText className="h-10 w-10 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mt-2">No Open Orders</p>
      </div>
    )
  }
  
  export function StatsGrid() {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order Value Received</CardTitle>
            <CardDescription>Order value converted to Sale: ₹ 0.00</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">₹ 0.00</div>
            {/* Replaced SampleBarChart with the new EmptyLineGraph component */}
            <EmptyLineGraph />
            <p className="text-xs text-muted-foreground text-center mt-2">Report: From 31 Aug to 06 Sep</p>
          </CardContent>
        </Card>
        <Card >
          <CardHeader>
            <CardTitle>Open Orders</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-full">
            <div className="text-5xl font-bold mb-4">0</div>
            <NoOrdersPlaceholder />
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardContent className="p-6 flex-1">
            <CardTitle className="text-base font-medium">Store View</CardTitle>
            <div className="flex items-center justify-between">
              <p className="text-5xl font-bold">0</p>
              <Link href="#" className="text-sm text-primary flex items-center gap-1"><Share2 className="h-4 w-4"/> Share Store</Link>
            </div>
          </CardContent>
          <Separator />
          <CardContent className="p-6 flex-1">
            <CardTitle className="text-base font-medium">Total Orders</CardTitle>
            <p className="text-5xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Orders delivered: <Link href="#" className="text-primary">0 Order</Link></p>
          </CardContent>
        </Card>
      </div>
    );
  }