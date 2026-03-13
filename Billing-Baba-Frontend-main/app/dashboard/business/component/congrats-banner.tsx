import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

export function CongratsBanner() {
  return (
    <div
      className="rounded-lg bg-blue-600 text-white p-6 text-center bg-cover bg-no-repeat"
      style={{ backgroundImage: "url('/confetti-bg.svg')" }} // Note: You need to have this SVG in your /public folder
    >
      <h3 className="text-xl font-bold">
        Congratulations, You have successfully setup your Online Store.
      </h3>
      <p className="mt-1 text-blue-100">
        Share store link with your customer & grow your business upto 10X.
      </p>
      <Button variant="secondary" className="mt-4 rounded-full bg-white text-blue-600 hover:bg-gray-100">
        <Share2 className="mr-2 h-4 w-4" />
        Share Online Store
      </Button>
    </div>
  );
}