import { Suspense } from "react";
import UpiContent from "../upi/PaymentUPIContent";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading payment details...</div>}>
      <UpiContent />
    </Suspense>
  );
}

