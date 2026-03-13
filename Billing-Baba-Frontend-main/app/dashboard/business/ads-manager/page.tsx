"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LifeBuoy,
  MoreVertical,
  Plus,
  PlayCircle,
  BookOpen,
  Info,
  Crown,
  ArrowRight,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { GetSupportDialog } from "../component/get-support-dialog";
import { BuyCreditsDialog } from "../component/buy-credits-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";


const Step = ({ num, title, status, isLast = false }: { num: number, title: string, status: 'PENDING' | 'DONE', isLast?: boolean }) => (
    <div className="flex items-center">
        <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border-2 border-blue-500">
                <Info className="h-5 w-5"/>
            </div>
            <p className="text-xs mt-2 text-center">{title}</p>
            <p className={`text-xs font-semibold ${status === 'PENDING' ? 'text-orange-500' : 'text-green-500'}`}>
                STEP {num}: {status}
            </p>
        </div>
        {!isLast && <div className="w-16 h-px bg-gray-300 mx-4"/>}
    </div>
);

const SetupTab = () => (
    <div className="mt-6 space-y-6">
        <Card className="overflow-hidden">
            <CardContent className="p-6 bg-blue-50/50 flex items-center justify-between relative">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold">Run Ads & Grow Your Business for Free! ✨</h2>
                    <p className="text-muted-foreground">Try our new Ads Manager and run ads to get leads on your WhatsApp! No approvals required.</p>
                    <div className="flex items-center space-x-6">
                        <a href="#" className="flex items-center gap-2 text-blue-600 font-semibold"><BookOpen className="h-5 w-5"/> How to setup Ads Manager?</a>
                        <a href="#" className="flex items-center gap-2 text-blue-600 font-semibold"><PlayCircle className="h-5 w-5"/> Watch Video</a>
                    </div>
                    {/* Stepper */}
                    <div className="flex items-start mt-6">
                        <Step num={1} title="Connect Your FB Account" status="PENDING" />
                        <Step num={2} title="Select your Ads Page" status="PENDING" />
                        <Step num={3} title="Link WhatsApp Number" status="PENDING" />
                         <div className="flex flex-col items-center ml-4">
                            <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-500 flex items-center justify-center">
                                <Crown className="h-5 w-5"/>
                            </div>
                            <p className="text-xs mt-2 text-center w-32">Run Ads & Get Leads on WhatsApp</p>
                            <p className="text-xs font-semibold text-green-500">CONGRATULATIONS</p>
                        </div>
                    </div>
                </div>
                 <Image src="/coins.png" alt="Coins" width={200} height={200} className="hidden md:block"/>
            </CardContent>
        </Card>
        <div 
            className="rounded-lg p-6 flex items-center justify-between text-white" 
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E"), linear-gradient(to right, #8b5cf6, #4f46e5)`
            }}
        >
            <div>
                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">LIMITED TIME OFFER</span>
                <p className="text-xl font-bold mt-2">Buy 2000 or more Ad Credits & Get 1000 Ad Credits BONUS for FREE! ✨</p>
            </div>
            <Button className="bg-yellow-400 text-black hover:bg-yellow-500 rounded-full font-bold text-base px-6 py-6">Buy Now & Get Bonus!</Button>
        </div>
        <Card>
            <CardContent className="p-6 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold">Connect Facebook Account</h3>
                        <p className="text-sm text-muted-foreground">Please select <strong className="text-primary">Opt in to all</strong> current and future Pages in step 1 and.<br/> <strong className="text-primary">Opt in to all</strong> current and future Businesses in step 2.</p>
                    </div>
                    <Button className="bg-red-500 hover:bg-red-600 text-white">Connect</Button>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold">Choose Facebook Page</h3>
                        <p className="text-sm text-muted-foreground">Select the page to be used for the ad. Only your page name and picture will be visible during any of the ads.</p>
                    </div>
                    <Select disabled><SelectTrigger className="w-[280px]"><SelectValue placeholder="Choose your page" /></SelectTrigger></Select>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold">Link WhatsApp Number</h3>
                        <p className="text-sm text-muted-foreground">This number must be registered on <strong className="text-primary">WhatsApp Business</strong>. You will receive leads on this number.</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <Input value="+91" disabled className="w-16"/>
                       <Input placeholder="WhatsApp Number" className="w-[200px]" disabled/>
                       <Button disabled>Verify</Button>
                    </div>
                </div>
                 <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold">Create Ad</h3>
                        <p className="text-sm text-muted-foreground">Customise your ad and start generating leads for your business.</p>
                    </div>
                    <Button variant="secondary" disabled><Plus className="h-4 w-4 mr-2"/>Create Ad</Button>
                </div>
            </CardContent>
        </Card>
    </div>
);

// ============================================================================
// NEW Component for the "Ads Dashboard" Tab
// ============================================================================
const StatCard = ({ title, value }: { title: string, value: string | number }) => (
    <Card className="flex-1">
        <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{title}</span>
                <Info className="h-3.5 w-3.5" />
            </div>
            <p className="text-2xl font-bold mt-1">{value}</p>
        </CardContent>
    </Card>
);

const AdsDashboardTab = () => (
    <div className="mt-6 space-y-6">
        <a href="#" className="text-blue-600 font-semibold flex items-center gap-2">
            Complete setup of Ad Account to use Ads Dashboard
            <ArrowRight className="h-4 w-4" />
        </a>
        <Card>
            <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search by Ad name" className="pl-10" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Select><SelectTrigger className="w-[180px]"><SelectValue placeholder="Select Status" /></SelectTrigger></Select>
                        <Button variant="outline"><RefreshCw className="h-4 w-4 mr-2"/>Refresh</Button>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <StatCard title="Cost Per Lead" value="₹ 0" />
                    <StatCard title="Number of Leads" value={0} />
                    <StatCard title="Click-Through Rate" value="0%" />
                    <StatCard title="Average Daily Spend" value="₹ 0" />
                    <StatCard title="Total Spend" value="₹ 0" />
                </div>
                {/* Table Placeholder */}
                <div className="border rounded-lg">
                    <div className="grid grid-cols-10 text-xs font-semibold text-muted-foreground bg-gray-50 p-3 rounded-t-lg">
                        <div className="col-span-1">Actions</div>
                        <div className="col-span-2">Advertisement</div>
                        <div className="col-span-1">Start Date</div>
                        <div className="col-span-1">Stop Date</div>
                        <div className="col-span-1">Status</div>
                        <div className="col-span-1">Reach</div>
                        <div className="col-span-1">CPL</div>
                        <div className="col-span-1">Leads</div>
                        <div className="col-span-1">CTR</div>
                    </div>
                    <div className="p-16 text-center text-muted-foreground">
                        No Advertisement yet!
                    </div>
                </div>
                {/* Pagination Placeholder */}
                <div className="flex items-center justify-end text-sm text-muted-foreground pt-4">
                    <span>Rows per page:</span>
                    <Select defaultValue="10"><SelectTrigger className="w-[60px] h-8 mx-2"><SelectValue /></SelectTrigger></Select>
                    <span>0-0 of 0</span>
                    <div className="flex items-center ml-4">
                        <Button variant="ghost" size="icon" disabled><ChevronLeft className="h-4 w-4"/></Button>
                        <Button variant="ghost" size="icon" disabled><ChevronRight className="h-4 w-4"/></Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
);

// ============================================================================
// NEW Component for the "Transactions" Tab
// ============================================================================
const TransactionsTab = () => (
    <div className="mt-6 space-y-6">
        <Card>
            <CardContent className="p-4 space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search by Order ID" className="pl-10" />
                    </div>
                    <Button variant="outline"><RefreshCw className="h-4 w-4 mr-2"/>Refresh</Button>
                </div>
                 {/* Table Placeholder */}
                <div className="border rounded-lg">
                    <div className="grid grid-cols-6 text-xs font-semibold text-muted-foreground bg-gray-50 p-3 rounded-t-lg">
                        <div>Date</div>
                        <div>Order ID</div>
                        <div>Payment ID</div>
                        <div>Total Amount</div>
                        <div>GST Amount</div>
                        <div>Credits Added</div>
                    </div>
                    <div className="p-16 text-center text-muted-foreground">
                        No transactions found!
                    </div>
                </div>
                 {/* Pagination Placeholder */}
                <div className="flex items-center justify-end text-sm text-muted-foreground pt-4">
                    <span>Rows per page:</span>
                    <Select defaultValue="10"><SelectTrigger className="w-[60px] h-8 mx-2"><SelectValue /></SelectTrigger></Select>
                    <span>0-0 of 0</span>
                    <div className="flex items-center ml-4">
                        <Button variant="ghost" size="icon" disabled><ChevronLeft className="h-4 w-4"/></Button>
                        <Button variant="ghost" size="icon" disabled><ChevronRight className="h-4 w-4"/></Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
);

// ============================================================================
// Main Page Component
// ============================================================================
export default function AdsManagerPage() {
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Ads Manager</h1>
        <div className="flex items-center space-x-2">
          <GetSupportDialog>
            <Button className="bg-red-500 hover:bg-red-600 text-white rounded-full"><LifeBuoy className="mr-2 h-4 w-4" /> Get Support</Button>
          </GetSupportDialog>
          <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
        </div>
      </header>

      <Tabs defaultValue="setup">
        <div className="flex items-center justify-between border-b">
            <TabsList className="bg-transparent p-0">
                <TabsTrigger value="setup" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-red-500 rounded-none">Setup</TabsTrigger>
                <TabsTrigger value="dashboard" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-red-500 rounded-none">Ads Dashboard</TabsTrigger>
                <TabsTrigger value="transactions" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-red-500 rounded-none">Transactions</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-4">
                <p className="text-sm font-semibold">Ad Credit: <span className="font-bold">₹ 0.00</span></p>
                <BuyCreditsDialog>
                    <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600">Buy Credits</Button>
                </BuyCreditsDialog>
                <Button variant="secondary" disabled><Plus className="h-4 w-4 mr-2"/>Create Ad</Button>
            </div>
        </div>
        
        {/* UPDATED: Each tab now renders its specific component */}
        <TabsContent value="setup"><SetupTab /></TabsContent>
        <TabsContent value="dashboard"><AdsDashboardTab /></TabsContent>
        <TabsContent value="transactions"><TransactionsTab /></TabsContent>
      </Tabs>
    </div>
  );
}