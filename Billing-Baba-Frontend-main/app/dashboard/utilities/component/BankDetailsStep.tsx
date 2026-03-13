import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const BankDetailsStep = ({ formData, handleInputChange }: Props) => {
  return (
    <div className="space-y-6">
       <div className="space-y-2">
        <Label htmlFor="accountHolder">Account Holder Name</Label>
        <Input id="accountHolder" name="accountHolder" value={formData.accountHolder} onChange={handleInputChange} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="accountNumber">Account Number</Label>
          <Input id="accountNumber" name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ifsc">IFSC Code</Label>
          <Input id="ifsc" name="ifsc" value={formData.ifsc} onChange={handleInputChange} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="bankName">Bank Name (Optional)</Label>
        <Input id="bankName" name="bankName" value={formData.bankName} onChange={handleInputChange} />
      </div>
    </div>
  );
};