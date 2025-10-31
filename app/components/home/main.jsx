import React from "react";
import { Sparkles } from "lucide-react"; 

const HomeMain = () =>  {
    return(
        <>
            <main className="flex flex-col items-center text-center px-6 py-10 sm:py-20">
                <h2 className="text-xl sm:text-6xl font-extrabold max-w-full leading-tight mb-6 text-gray-900">
                    Every kind of care made simple and accessible for all people,
                    anywhere in the world.
                </h2>

                <p className="text-gray-800 max-w-2xl mb-8 text-base sm:text-lg">
                    Ask me anything about your symptoms, finding care, or exploring
                    health options.
                </p>

                {/* GPT Badge */}
                <div className="bg-[rgb(55,0,231)]/10 text-[rgb(55,0,231)] px-4 py-1.5 rounded-full text-sm font-medium mb-8 shadow-sm items-center gap-2 inline-flex">
                        <Sparkles className="w-5 h-5 text-[rgb(55,0,231)] animate-pulse" />Powered by GPT
                </div>

                {/* Search Bar */}
                <div className="bg-white flex items-center rounded-full shadow-lg overflow-hidden w-full max-w-2xl mb-8 p-2">
                    <input
                        type="text"
                        placeholder="Tell me what’s wrong or what you’re looking for..."
                        className="flex-1 px-5 py-3 text-gray-800 focus:outline-none"
                    />
                    <button className="bg-[rgb(55,0,231)] cursor-pointer hover:bg-[rgb(75,20,255)] text-white font-semibold py-3 px-6 rounded-full transition">
                        Get Started
                    </button>
                </div>

                {/* Suggestions */}
                <div className="flex flex-wrap justify-center gap-3 max-w-3xl">
                    {[
                        "Find a doctor for my headaches",
                        "I have a skin rash, what could it be?",
                        "Therapists near me that take my insurance",
                        "What are the symptoms of the flu?",
                        "Find a local dentist for a check-up",
                        "Low-cost clinics in my area",
                    ].map((item, index) => (
                        <span
                            key={index}
                            className="bg-[rgb(221,232,248)] text-gray-800 px-4 py-2 rounded-full text-sm hover:bg-[rgb(55,0,231)]/10 cursor-pointer hover:text-gray-900 transition"
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </main>

        </>
    )
}
export default HomeMain;