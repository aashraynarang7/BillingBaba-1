import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";

const FieldRow = ({ id, label, defaultChecked = false, placeholder }: { id: string, label: string, defaultChecked?: boolean, placeholder: string }) => (
    <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex items-center gap-2">
            <Checkbox id={id} defaultChecked={defaultChecked} />
            <Input placeholder={placeholder} disabled={!defaultChecked}/>
        </div>
    </div>
);

export const ItemFieldsStep = () => (
    <div>
        <h3 className="font-semibold flex items-center gap-2 mb-4">Set Up Item Fields <Info className="h-4 w-4 text-muted-foreground"/></h3>
        <div className="grid grid-cols-2 gap-6">
            <FieldRow id="batchNo" label="Batch Field 1 Name" placeholder="Batch No." defaultChecked/>
            <FieldRow id="expDate" label="Batch Field 2 Name" placeholder="Exp. Date" defaultChecked/>
            <FieldRow id="mfgDate" label="Batch Field 3 Name" placeholder="Mfg. Date" defaultChecked/>
            <FieldRow id="manufacturer" label="Batch Field 4 Name" placeholder="Manufacturer Name" defaultChecked/>
            <FieldRow id="dosage" label="Batch Field 5 Name" placeholder="Dosage" defaultChecked/>
        </div>
    </div>
);