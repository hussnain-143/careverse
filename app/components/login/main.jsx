"use client";
import React, { useActionState } from "react";

// ✅ Validation for login form
function validateLogin(prevState, formData) {
    const email = formData.get("email")?.trim();
    const password = formData.get("password")?.trim();
    const errors = {};

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Please enter a valid email address.";
    }

    if (!password) {
        errors.password = "Password is required.";
    }

    if (Object.keys(errors).length > 0) {
        return { success: false, errors };
    }

    return { success: true, message: "Login successful!" };
}

export default function LoginPage() {
    const [state, formAction] = useActionState(validateLogin, {
        success: null,
        errors: {},
        message: "",
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-[rgb(120,195,235)] to-[rgb(180,159,216)] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col max-w-[1200px] mx-auto min-h-screen">
                {/* Centered Form Card */}
                <div className="flex flex-1 flex-col gap-6 sm:gap-10 items-center justify-center">
                    {/* Logo + Title */}
                    <div className="p-4 sm:p-6 text-center">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 flex items-center justify-center gap-2">
                            <span className="inline-block w-3 h-3 rounded-full bg-[rgb(55,0,231)]"></span>
                            Careverse
                        </h2>
                    </div>

                    <div className="bg-[rgb(221,232,248)] backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-md">
                        <h1 className="text-xl sm:text-2xl font-bold text-center mb-2 text-black">
                            Welcome Back
                        </h1>
                        <p className="text-center text-gray-700 mb-6 text-sm sm:text-base">
                            Please login to your{" "}
                            <span className="font-semibold text-[rgb(55,0,231)]">Careverse</span> account.
                        </p>

                        <form action={formAction} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full text-gray-700 rounded-md border border-gray-300 p-2 sm:p-3 focus:ring-2 focus:ring-[rgb(55,0,231)] outline-none text-sm sm:text-base"
                                />
                                {state.errors?.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {state.errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full text-gray-700 rounded-md border border-gray-300 p-2 sm:p-3 focus:ring-2 focus:ring-[rgb(55,0,231)] outline-none text-sm sm:text-base"
                                />
                                {state.errors?.password && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {state.errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Remember + Forgot */}
                            <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-0 text-sm">
                                <label className="flex items-center gap-2 text-gray-600">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        className="accent-[rgb(55,0,231)]"
                                    />
                                    Remember me
                                </label>
                                <a
                                    href="#"
                                    className="text-[rgb(55,0,231)] hover:underline font-medium"
                                >
                                    Forgot Password?
                                </a>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-[rgb(55,0,231)] hover:bg-[rgb(75,20,255)] text-white font-semibold py-2 sm:py-3 rounded-md transition-all duration-200 text-sm sm:text-base"
                            >
                                Login
                            </button>

                            {/* Success Message */}
                            {state.success && (
                                <p className="text-green-600 text-center mt-3 font-medium">
                                    {state.message}
                                </p>
                            )}
                        </form>

                        {/* Footer */}
                        <p className="text-center text-sm text-gray-700 mt-6">
                            Don’t have an account?{" "}
                            <a
                                href="/register"
                                className="text-[rgb(55,0,231)] hover:underline font-medium"
                            >
                                Register here
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
