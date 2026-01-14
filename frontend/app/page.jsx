"use client";

import Home from "@/views/Home";
import PixelTracker from "@/components/PixelTracker";
import FloatingSupport from "@/components/FloatingSupport";

export default function HomePage() {
  return (
    <>
      <PixelTracker />
      <Home />
      <FloatingSupport />
    </>
  );
}
