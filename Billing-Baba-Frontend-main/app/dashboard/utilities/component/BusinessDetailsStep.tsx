import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

export const BusinessDetailsStep = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="companyName">Company Name*</Label>
                <Input id="companyName" defaultValue="heloo" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number*</Label>
                <Input id="phone" defaultValue="9310891509" />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="businessCategory">Choose Business Category*</Label>
                <Select defaultValue="pharma">
                    <SelectTrigger id="businessCategory"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pharma">Pharmacy/ Medical</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="drugLicense">Drug License Number</Label>
                <Input id="drugLicense" placeholder="Enter Drug License Number" />
            </div>
        </div>
        <Button variant="link" className="p-0 text-blue-600">
            <Plus className="h-4 w-4 mr-1"/> See More Fields
        </Button>
    </div>
);
