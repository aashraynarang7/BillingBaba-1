"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, Save, Plus, Camera, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AddItemPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("pricing");
    const [isService, setIsService] = useState(false);

    // Using react-hook-form
    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            type: "product",
            name: "",
            hsn: "",
            unit: "pcs",
            category: "",
            itemCode: "",
            salePrice: 0,
            saleTaxType: "withoutTax",
            discountValue: 0,
            discountType: "percentage",
            purchasePrice: 0,
            purchaseTaxType: "withoutTax",
            taxRate: 0,
            openingStock: 0,
            minStockToMaintain: 0,
            location: "",
            atPrice: 0
        }
    });

    const onSubmit = async (data) => {
        try {
            // Prepare payload to match backend schema
            const payload = {
                type: isService ? "service" : "product",
                name: data.name,
                hsn: data.hsn,
                unit: data.unit,
                category: data.category,
                itemCode: data.itemCode,
                salePrice: {
                    amount: Number(data.salePrice),
                    taxType: data.saleTaxType
                },
                discount: {
                    value: Number(data.discountValue),
                    type: data.discountType
                },
                purchasePrice: {
                    amount: Number(data.purchasePrice),
                    taxType: data.purchaseTaxType
                },
                taxRate: Number(data.taxRate),
                stock: {
                    openingQuantity: Number(data.openingStock),
                    atPrice: Number(data.atPrice),
                    minStockToMaintain: Number(data.minStockToMaintain),
                    location: data.location
                }
            };

            const response = await fetch("http://localhost:5000/api/items", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                // Success
                alert("Item created successfully!");
                // router.push("/items"); // Navigate back to list
            } else {
                const err = await response.json();
                alert(`Error: ${err.error || "Failed to create item"}`);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Something went wrong");
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-5xl">
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/items" className="text-muted-foreground hover:text-primary">
                            <ArrowLeft size={24} />
                        </Link>
                        <h1 className="text-2xl font-bold">Add Item</h1>

                        <div className="flex items-center gap-2 ml-6 bg-secondary/20 p-1 rounded-full border">
                            <div
                                className={`cursor-pointer px-4 py-1 rounded-full text-sm font-medium transition-colors ${!isService ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                                onClick={() => { setIsService(false); setValue("type", "product"); }}
                            >
                                Product
                            </div>
                            <Switch
                                checked={isService}
                                onCheckedChange={(checked) => {
                                    setIsService(checked);
                                    setValue("type", checked ? "service" : "product");
                                }}
                                className="hidden" // Hiding actual switch to implement custom toggle look if desired, or keep standard
                            />
                            {/* Better toggle UI as per image: Text Label + Toggle Switch + Text Label */}
                            <div
                                className={`cursor-pointer px-4 py-1 rounded-full text-sm font-medium transition-colors ${isService ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
                                onClick={() => { setIsService(true); setValue("type", "service"); }}
                            >
                                Service
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button type="button" variant="outline" size="icon"><Settings size={20} /></Button>
                        <Link href="/items"><Button variant="ghost" size="icon">X</Button></Link>
                    </div>
                </div>

                <Card className="mb-6 border-none shadow-sm bg-card">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                            {/* Left Side: General Info */}
                            <div className="md:col-span-9 space-y-4">

                                <div className="flex gap-4 items-start">
                                    <div className="flex-1">
                                        <Label htmlFor="name" className="text-primary font-semibold mb-1 block">Item Name *</Label>
                                        <Input
                                            id="name"
                                            {...register("name", { required: true })}
                                            className="border-primary/50 focus:border-primary"
                                            placeholder="Enter item name"
                                        />
                                        {errors.name && <span className="text-destructive text-xs">Name is required</span>}
                                    </div>

                                    <div className="w-1/4">
                                        <Label htmlFor="hsn" className="mb-1 block">Item HSN</Label>
                                        <div className="flex">
                                            <Input id="hsn" {...register("hsn")} placeholder="Search HSN" className="rounded-r-none" />
                                            <Button type="button" variant="outline" className="rounded-l-none border-l-0 px-3"><Settings size={16} /></Button>
                                        </div>
                                    </div>

                                    <div className="w-1/4">
                                        <Label htmlFor="unit" className="mb-1 block">Unit</Label>
                                        <Controller
                                            control={control}
                                            name="unit"
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger className="bg-secondary/20 text-secondary-foreground border-none">
                                                        <SelectValue placeholder="Select Unit" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                                                        <SelectItem value="kg">Kilogram (kg)</SelectItem>
                                                        <SelectItem value="ltr">Liter (ltr)</SelectItem>
                                                        <SelectItem value="box">Box</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 items-start">
                                    <div className="w-1/3">
                                        <Label htmlFor="category" className="mb-1 block text-muted-foreground">Category</Label>
                                        <Controller
                                            control={control}
                                            name="category"
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="general">General</SelectItem>
                                                        <SelectItem value="electronics">Electronics</SelectItem>
                                                        <SelectItem value="groceries">Groceries</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>
                                    <div className="w-1/3">
                                        <Label htmlFor="itemCode" className="mb-1 block text-muted-foreground">Item Code</Label>
                                        <div className="flex items-center gap-2">
                                            <Input id="itemCode" {...register("itemCode")} placeholder="Enter Code" />
                                            <Button type="button" variant="secondary" size="sm" className="whitespace-nowrap">Assign Code</Button>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Right Side: Image */}
                            <div className="md:col-span-3 flex justify-center items-start pt-2">
                                <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition w-full h-full min-h-[150px]">
                                    <div className="bg-blue-50 p-3 rounded-full mb-2">
                                        <Camera className="text-blue-500" size={24} />
                                    </div>
                                    <span className="text-sm font-medium text-blue-500">Add Item Image</span>
                                </div>
                            </div>

                        </div>
                    </CardContent>
                </Card>

                {/* Tabs Region */}
                <div className="bg-card rounded-lg shadow-sm border">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="border-b px-4">
                            <TabsList className="bg-transparent h-12 gap-6">
                                <TabsTrigger
                                    value="pricing"
                                    className="data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:text-red-500 data-[state=active]:shadow-none rounded-none bg-transparent px-0 text-muted-foreground font-medium"
                                >
                                    Pricing
                                </TabsTrigger>
                                {!isService && (
                                    <TabsTrigger
                                        value="stock"
                                        className="data-[state=active]:border-b-2 data-[state=active]:border-red-500 data-[state=active]:text-red-500 data-[state=active]:shadow-none rounded-none bg-transparent px-0 text-muted-foreground font-medium"
                                    >
                                        Stock
                                    </TabsTrigger>
                                )}
                            </TabsList>
                        </div>

                        {/* Pricing Tab */}
                        <TabsContent value="pricing" className="p-6 space-y-8">

                            {/* Sale Price Section */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-base">Sale Price</h3>
                                <div className="flex flex-wrap gap-4 items-end">
                                    <div className="flex-1 min-w-[200px]">
                                        <div className="flex border rounded-md focus-within:ring-1 ring-primary">
                                            <Input
                                                type="number"
                                                placeholder="0"
                                                {...register("salePrice")}
                                                className="border-none focus-visible:ring-0 rounded-r-none"
                                            />
                                            <Controller
                                                control={control}
                                                name="saleTaxType"
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger className="w-[130px] border-none border-l rounded-l-none bg-muted/20">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="withoutTax">Without Tax</SelectItem>
                                                            <SelectItem value="withTax">With Tax</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-[200px]">
                                        <div className="flex border rounded-md focus-within:ring-1 ring-primary">
                                            <Input
                                                type="number"
                                                placeholder="Discount"
                                                {...register("discountValue")}
                                                className="border-none focus-visible:ring-0 rounded-r-none"
                                            />
                                            <Controller
                                                control={control}
                                                name="discountType"
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger className="w-[120px] border-none border-l rounded-l-none bg-muted/20">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="percentage">Percentage</SelectItem>
                                                            <SelectItem value="amount">Amount</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <Button type="button" variant="link" className="text-blue-500 h-auto p-0 px-2">+ Add Wholesale Price</Button>
                            </div>

                            <Separator />

                            {/* Purchase Price & Taxes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Purchase Price */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-base">Purchase Price</h3>
                                    <div className="flex border rounded-md focus-within:ring-1 ring-primary">
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            {...register("purchasePrice")}
                                            className="border-none focus-visible:ring-0 rounded-r-none"
                                        />
                                        <Controller
                                            control={control}
                                            name="purchaseTaxType"
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger className="w-[130px] border-none border-l rounded-l-none bg-muted/20">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="withoutTax">Without Tax</SelectItem>
                                                        <SelectItem value="withTax">With Tax</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Taxes */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-base">Taxes</h3>
                                    <div>
                                        <Label className="text-xs text-muted-foreground mb-1 block">Tax Rate</Label>
                                        <Controller
                                            control={control}
                                            name="taxRate"
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="None" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="0">None</SelectItem>
                                                        <SelectItem value="5">GST @ 5%</SelectItem>
                                                        <SelectItem value="12">GST @ 12%</SelectItem>
                                                        <SelectItem value="18">GST @ 18%</SelectItem>
                                                        <SelectItem value="28">GST @ 28%</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                        </TabsContent>

                        {/* Stock Tab */}
                        <TabsContent value="stock" className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <Label>Opening Stock</Label>
                                    <Input type="number" {...register("openingStock")} placeholder="0" />
                                </div>
                                <div>
                                    <Label>At Price</Label>
                                    <Input type="number" {...register("atPrice")} placeholder="0" />
                                </div>
                                <div>
                                    <Label>Min Stock To Maintain</Label>
                                    <Input type="number" {...register("minStockToMaintain")} placeholder="0" />
                                </div>
                                <div>
                                    <Label>Location</Label>
                                    <Input {...register("location")} placeholder="Shelf A" />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-4 mt-6 border-t pt-4 bg-background sticky bottom-0 z-10">
                    <Button type="button" variant="outline" className="min-w-[120px]">Save & New</Button>
                    <Button type="submit" className="min-w-[120px] bg-primary text-primary-foreground hover:bg-primary/90">Save</Button>
                </div>

            </form>
        </div>
    );
}
