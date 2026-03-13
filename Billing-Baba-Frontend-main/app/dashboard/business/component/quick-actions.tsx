import { Card, CardContent } from "@/components/ui/card";
import { BarChart2, ChevronRight, FileText, Package } from "lucide-react";
import Link from "next/link"; // Import the Link component

const actions = [
  {
    icon: Package,
    title: "Manage Items",
    description: "Total items added - 2",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    href: "/dashboard/business/online-store/manage-items", // Add a link destination
  },
  {
    icon: FileText,
    title: "Manage Orders",
    description: "Order delivered till date - 0",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    href: "/dashboard/sales?view=order", // Add a link destination
  },
  {
    icon: BarChart2,
    title: "Store Reports",
    description: "Today's Sale - ₹ 0.00",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    href: "/dashboard/business/store-reports", // Add a link destination
  },
];

export function QuickActions() {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-4">Quick Actions</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {actions.map((action) => (
          // Wrap the entire Card in a Link component
          <Link href={action.href} key={action.title}>
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${action.iconBg}`}>
                    <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}