import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";

const FieldRow = ({ id, label, defaultChecked = false, placeholder, colSpan = "col-span-1" }: { id: string, label: string, defaultChecked?: boolean, placeholder: string, colSpan?: string }) => (
    <div className={`space-y-2 ${colSpan}`}>
        <Label>{label}</Label>
        <div className="flex items-center gap-2">
            <Checkbox id={id} defaultChecked={defaultChecked} />
            <Input placeholder={placeholder} disabled={!defaultChecked}/>
        </div>
    </div>
);

export const PartyTransactionStep = () => (
    <div className="space-y-8">
        <div>
            <h3 className="font-semibold flex items-center gap-2 mb-4">Party Fields <Info className="h-4 w-4 text-muted-foreground"/></h3>
            <div className="grid grid-cols-2 gap-6">
                <FieldRow id="drugLicense" label="Additional Field 1 Name" placeholder="Drug License No" defaultChecked/>
                <FieldRow id="pan" label="Additional Field 2 Name" placeholder="PAN Number" defaultChecked/>
                <FieldRow id="ageGender" label="Additional Field 3 Name" placeholder="Age/Gender" defaultChecked/>
                <FieldRow id="drugExp" label="Additional Field 4 Name" placeholder="Drug License Exp. Date" defaultChecked/>
            </div>
        </div>
        <div>
            <h3 className="font-semibold flex items-center gap-2 mb-4">Transaction Fields <Info className="h-4 w-4 text-muted-foreground"/></h3>
             <div className="grid grid-cols-2 gap-6">
                <FieldRow id="doctorName" label="Additional Field 1 Name" placeholder="Doctor's Name" defaultChecked/>
                <FieldRow id="diagnosis" label="Additional Field 2 Name" placeholder="Diagnosis" defaultChecked/>
                <FieldRow id="salesman" label="Additional Field 3 Name" placeholder="Salesman Name" defaultChecked/>
                <FieldRow id="addField4" label="Additional Field 4 Name" placeholder="Enter Additional Field 4 Name"/>
            </div>
        </div>
    </div>
);