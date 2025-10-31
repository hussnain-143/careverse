import React from "react";

const HomeHeader = () =>  {
    return(
        <>
            <header className="flex justify-between items-center px-6 sm:px-12 py-6">
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-[rgb(55,0,231)] rounded-full shadow-sm"></div>
                    <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                        Careverse
                    </h1>
                </div>

                <nav className="flex items-center space-x-6">
                    <a href="#how-it-works" className="text-gray-800 hover:text-[rgb(55,0,231)] font-medium transition">
                        How It Works
                    </a>
                    <a href="#about" className="text-gray-800 hover:text-[rgb(55,0,231)] font-medium transition">
                        About Us
                    </a>
                    <a
                        href="/login"
                        className="bg-[rgb(55,0,231)] hover:bg-[rgb(75,20,255)] text-white font-semibold py-2 px-5 rounded-full transition"
                    >
                        Login
                    </a>
                </nav>
            </header>
        </>
    )
}

export default HomeHeader;