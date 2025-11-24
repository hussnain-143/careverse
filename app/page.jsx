"use client";
import React, { Suspense } from "react";
const HomeHeader = React.lazy(() => import("./components/home/header"));
const HomeFooter = React.lazy(() => import("./components/home/footer"));
const HomeMain = React.lazy(() => import("./components/home/main"));
import LocationModal from "./components/home/LocationModal";
import Loading from "./loading";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[rgb(120,195,235)] via-[rgb(150,177,225)] to-[rgb(180,159,216)] relative">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[rgb(55,0,231)]/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[rgb(75,20,255)]/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[rgb(120,195,235)]/25 rounded-full blur-3xl"></div>
        
        {/* Additional decorative elements */}
        <div className="absolute top-40 right-20 w-64 h-64 bg-[rgb(55,0,231)]/8 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 left-20 w-56 h-56 bg-[rgb(75,20,255)]/8 rounded-full blur-2xl"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>
      
      {/* Header - Sticky */}
      <Suspense fallback={<Loading message="Loading..." />}>
        <HomeHeader />
      </Suspense>
      
      <div className="flex-1 max-w-[1400px] mx-auto w-full flex flex-col justify-between text-gray-900 px-4 sm:px-6 lg:px-8 relative z-10">
        <Suspense fallback={<Loading message="Loading..." />}>
          <HomeMain />
          <HomeFooter />
        </Suspense>

        <LocationModal />
      </div>
    </div>
  );
}
