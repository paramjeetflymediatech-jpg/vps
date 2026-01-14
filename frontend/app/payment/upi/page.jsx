import { Suspense } from "react";
import UpiPaymentClient from "./upiPaymentClient.jsx";

// Server Component page: uses `searchParams` and passes them to a Client Component.
// This avoids calling `useSearchParams()` during prerender and fixes the build error.

export default function UpiPaymentPage({ searchParams }) {
  const amount = searchParams?.amount ?? "0";
  const plan = searchParams?.plan ?? "Session Activation";
  const tutorId = searchParams?.tutorId ?? null;

  return (
    <Suspense fallback={<div>Loading payment page...</div>}>
      <UpiPaymentClient amount={amount} plan={plan} tutorId={tutorId} />
    </Suspense>
  );
}
