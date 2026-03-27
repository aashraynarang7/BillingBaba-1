import React from "react";
import ReportsSidebar from "./ReportsSidebar";

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full" style={{ height: '100%' }}>
      <ReportsSidebar />
      <div className="flex-1 overflow-y-scroll p-6">{children}</div>
    </div>
  );
}
