import { Suspense } from "react";
import { PaymentContent } from "../../../src/components/PaymentContent";

export default function PaymentSuccessPage() {
  return (
    // This boundary works best when the parent is a Server Component
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-gray-500">
            Loading payment details...
          </div>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
