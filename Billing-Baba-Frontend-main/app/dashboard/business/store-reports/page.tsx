"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar as CalendarIcon,
  Info,
  ListOrdered,
  Package,
  Eye,
  Wallet,
} from "lucide-react";

// A reusable component for the "Unable to generate report" placeholder
const ReportPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-10">
    <p className="font-semibold">Unable to generate report</p>
    <p className="text-sm">No data available for selected time frame.</p>
  </div>
);

// A self-contained component to render the sample line chart for Store Views
const SampleStoreViewsChart = () => (
  <div className="w-full h-48 mt-4">
    <svg width="100%" height="100%" viewBox="0 0 300 120" preserveAspectRatio="none">
      {/* Y-axis labels and grid lines */}
      {[5, 4, 2, 0].map((val, index) => (
        <g key={val}>
          <text
            x="10"
            y={110 - (val * 20)}
            fontSize="10"
            fill="#9ca3af"
            textAnchor="middle"
          >
            {val}
          </text>
          {val !== 0 && (
             <line
                x1="25"
                y1={110 - (val * 20)}
                x2="290"
                y2={110 - (val * 20)}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="2,2"
             />
          )}
        </g>
      ))}
      {/* X-axis labels and base line */}
      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
        // FIX: The key is now guaranteed to be unique by using the index
        <text key={`${day}-${index}`} x={40 + index * 40} y="120" fontSize="10" fill="#9ca3af" textAnchor="middle">
          {day}
        </text>
      ))}
      <line x1="25" y1="110" x2="290" y2="110" stroke="#d1d5db" strokeWidth="1" />
      {/* Data points and line */}
      <circle cx="40" cy="110" r="2" fill="#3b82f6" />
      <circle cx="80" cy="110" r="2" fill="#3b82f6" />
      <circle cx="120" cy="110" r="2" fill="#3b82f6" />
      <circle cx="160" cy="110" r="2" fill="#3b82f6" />
      <circle cx="200" cy="110" r="2" fill="#3b82f6" />
      <circle cx="240" cy="110" r="2" fill="#3b82f6" />
      <circle cx="280" cy="30" r="2" fill="#3b82f6" />
      {/* The shaded area */}
      <polygon points="240,110 280,30 280,110" fill="rgba(59, 130, 246, 0.2)" />
      {/* The line connecting the points */}
      <polyline
        points="40,110 80,110 120,110 160,110 200,110 240,110 280,30"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="1.5"
      />
    </svg>
  </div>
);

export default function StoreReportsPage() {
  const [activeDuration, setActiveDuration] = useState("This Week");
  const durations = ["This Week", "This Month", "This Quarter", "This Year"];

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Store Reports</h1>

      {/* Duration Filters */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground mb-2">Duration</h2>
        <div className="flex flex-wrap items-center gap-2">
          {durations.map((duration) => (
            <Button
              key={duration}
              variant={activeDuration === duration ? "default" : "secondary"}
              onClick={() => setActiveDuration(duration)}
            >
              {duration}
            </Button>
          ))}
          <Button variant="outline" className="h-10">
            <CalendarIcon className="mr-2 h-4 w-4" />
            31/08/2025 TO 06/09/2025
          </Button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Value Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-500"/>
              Order Value
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </CardTitle>
            <Button variant="destructive" size="sm"> <a href="/dashboard/sales?view=order">Show Orders</a></Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹ 0.00</div>
            <ReportPlaceholder />
          </CardContent>
        </Card>

        {/* Store Views Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-500" />
              Store Views
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </CardTitle>
            <Button variant="destructive" size="sm">Share Store</Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <SampleStoreViewsChart />
          </CardContent>
        </Card>

        {/* Orders Received Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ListOrdered className="h-5 w-5 text-blue-500" />
              Orders Received
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </CardTitle>
            <Button variant="destructive" size="sm">Share Store</Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <ReportPlaceholder />
          </CardContent>
        </Card>

        {/* Most Ordered Items Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-500" />
              Most Ordered Items
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </CardTitle>
            <Button variant="destructive" size="sm">Show Orders</Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <ReportPlaceholder />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}