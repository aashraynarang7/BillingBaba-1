"use client"
import { Header } from "../component/Header";
import { StoreInfo } from "../component/store-info";
import { CongratsBanner } from "../component/congrats-banner";
import { StatsGrid } from "../component/stats-grid";
import { QuickActions } from "../component/quick-actions";

export default function OnlineStorePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-muted/40">
      <div className="space-y-6">
        <Header />
        <StoreInfo />
        <CongratsBanner />
        <StatsGrid />
        <QuickActions />
      </div>
    </div>
  );
}