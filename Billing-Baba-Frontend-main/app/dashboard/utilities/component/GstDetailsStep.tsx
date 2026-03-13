import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Props {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const GstDetailsStep = ({ formData, setFormData }: Props) => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Are you registered for GST?</Label>
        <RadioGroup
          value={formData.isGstRegistered}
          onValueChange={(value) => setFormData(prev => ({ ...prev, isGstRegistered: value }))}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="gst-yes" />
            <Label htmlFor="gst-yes">Yes, I am registered</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="gst-no" />
            <Label htmlFor="gst-no">No, I am not registered</Label>
          </div>
        </RadioGroup>
      </div>
      {formData.isGstRegistered === 'yes' && (
        <div className="space-y-2">
          <Label htmlFor="gstin">GSTIN</Label>
          <Input 
            id="gstin" 
            name="gstin"
            value={formData.gstin}
            onChange={(e) => setFormData(prev => ({ ...prev, gstin: e.target.value }))} 
            placeholder="Enter your 15-digit GSTIN" 
          />
        </div>
      )}
    </div>
  );
};