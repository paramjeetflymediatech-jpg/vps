import { Suspense } from "react";
import UpiPaymentClient from "../../../src/views/UpiPaymentClient";

export const dynamic = "force-dynamic"; // ensures SSR (not static)

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading payment…</div>}>
      <UpiPaymentClient />
    </Suspense>
  );
}
