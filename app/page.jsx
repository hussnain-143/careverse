import React from "react";
const HomeHeader = React.lazy(() => import("./components/home/header"));
const HomeFooter = React.lazy(() => import("./components/home/footer"));
const HomeMain = React.lazy(() => import("./components/home/main"));

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[rgb(120,195,235)] to-[rgb(180,159,216)] ">
            <div className="max-w-[1200px] mx-auto flex flex-col justify-between min-h-screen text-gray-900">

            {/* Header */}
            <React.Suspense fallback={<div>Loading...</div>}>
                <HomeHeader />
            </React.Suspense>

            {/* Main Content */}
            <React.Suspense fallback={<div>Loading...</div>}>
                <HomeMain />
            </React.Suspense>

            {/* Footer */}
            <React.Suspense fallback={<div>Loading...</div>}>
                <HomeFooter />
            </React.Suspense>

            </div>
        </div>
    );
}
