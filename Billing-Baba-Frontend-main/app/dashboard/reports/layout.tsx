import React from "react";
import ReportsSidebar from "./ReportsSidebar"; // Assuming sidebar is in the same folder

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full bg-background-light overflow-hidden">
      <ReportsSidebar />
      <div className="flex-1 overflow-y-auto p-6">{children}</div>
    </div>
  );
}
