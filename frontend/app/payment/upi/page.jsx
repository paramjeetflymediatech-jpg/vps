// app/payment/upi/page.jsx
import { Suspense } from "react";
import PaymentUPIContent from "./PaymentUPIContent";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <PaymentUPIContent />
    </Suspense>
  );
}

function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <p className="text-gray-500 font-medium">Loading payment details...</p>
    </div>
  );
}
