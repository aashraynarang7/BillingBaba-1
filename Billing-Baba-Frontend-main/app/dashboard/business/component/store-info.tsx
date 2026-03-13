import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Eye, RefreshCw } from "lucide-react";
import Link from "next/link";
import { ForceSyncDialog } from "./force-sync-dialog";
import { PreviewDialog } from "./preview-dialog";
import { EditStoreDialog } from "./edit-store-dialog";

export function StoreInfo() {
  return (
    <Card>
      <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>H</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-lg font-semibold">heloo</h2>
              <Link href="#" className="text-xs text-primary">+ Add description</Link>
            </div>
            <div className="text-sm text-muted-foreground">
              <Link href="#" className="text-primary hover:underline">https://vyaparapp.in/store/heloo1</Link>
              <span className="mx-2">|</span>
              <Link href="#" className="text-primary font-medium hover:underline">Get your own Website</Link>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <ForceSyncDialog>
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" /> Force Sync Up
            </Button>
          </ForceSyncDialog>
          <PreviewDialog>
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" /> Preview
            </Button>
          </PreviewDialog>
          <EditStoreDialog>
            <Button variant="default">
              <Edit className="mr-2 h-4 w-4" /> Edit Store Info
            </Button>
          </EditStoreDialog>
        </div>
      </CardContent>
    </Card>
  );
}