import { Button } from "@/components/ui/button";
import { Settings, Share2 } from "lucide-react";
import { StoreSettingsDialog } from "../component/store-settings-dialog";
import { ShareDialog } from "../component/share-dialog";

export function Header() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold tracking-tight">My Online Store</h1>
      <div className="flex items-center space-x-2">
        <ShareDialog>
          <Button>
            <Share2 className="mr-2 h-4 w-4" /> Share Online Store
          </Button>
        </ShareDialog>
        <StoreSettingsDialog>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </StoreSettingsDialog>
      </div>
    </div>
  );
}