"use client";

import { Suspense } from "react";
import RoutesPageContent from "./RoutesPageContent";

export default function RoutesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#5d4a15]"></div>
          <p className="mt-4 text-gray-600">Loading routes...</p>
        </div>
      </div>
    }>
      <RoutesPageContent />
    </Suspense>
  );
}
