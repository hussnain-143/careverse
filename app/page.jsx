"use client";
import React, { Suspense } from "react";
const HomeHeader = React.lazy(() => import("./components/home/header"));
const HomeFooter = React.lazy(() => import("./components/home/footer"));
const HomeMain = React.lazy(() => import("./components/home/main"));
import LocationModal from "./components/home/LocationModal";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[rgb(120,195,235)] to-[rgb(180,159,216)]">
      <div className="max-w-[1200px] mx-auto flex flex-col justify-between min-h-screen text-gray-900 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
          <HomeHeader />
          <HomeMain />
          <HomeFooter />
        </Suspense>

        <LocationModal />
      </div>
    </div>
  );
}
