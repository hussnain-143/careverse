"use client";
import React, { useActionState } from "react";

// ✅ Validation function
function validateForm(prevState, formData) {
    const email = formData.get("email")?.trim();
    const password = formData.get("password")?.trim();
    const confirm = formData.get("confirm")?.trim();

    const errors = {};

    // Email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.email = "Please enter a valid email address.";
    }

    // Password check
    if (!password || password.length < 8) {
        errors.password = "Password must be at least 8 characters.";
    }

    // Confirm password
    if (password !== confirm) {
        errors.confirm = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
        return { success: false, errors };
    }

    // ✅ Success
    return { success: true, message: "Account created successfully!" };
}

export default function RegisterPage() {
    const [state, formAction] = useActionState(validateForm, {
        success: null,
        errors: {},
        message: "",
    });

    return (
        <div className="min-h-screen bg-gradient-to-b from-[rgb(120,195,235)] to-[rgb(180,159,216)]">
            <div className="flex flex-col  max-w-[1200px] mx-auto min-h-screen">
                {/* Logo */}
                

                {/* Form */}
                <div className="flex flex-1 flex-col gap-10 items-center justify-center">
                    <div className="p-6">
                    <h2 className="text-4xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="inline-block w-3 h-3 rounded-full bg-[rgb(55,0,231)]"></span>
                        Careverse
                    </h2>
                </div>
                    <div className="bg-[rgb(221,232,248)] backdrop-blur-md rounded-2xl shadow-lg p-8 w-full max-w-md">
                        <h1 className="text-2xl font-bold text-center mb-2 text-black">
                            Create an Account
                        </h1>
                        <p className="text-center text-gray-600 mb-6">
                            Join <span className="font-semibold text-[rgb(55,0,231)]">Careverse</span> to start
                            your personalized health journey.
                        </p>

                        <form action={formAction} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full text-gray-700 rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-[rgb(55,0,231)] outline-none"
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
                                    className="w-full rounded-md border text-gray-700 border-gray-300 p-2 focus:ring-2 focus:ring-[rgb(55,0,231)] outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Must be at least 8 characters long.
                                </p>
                                {state.errors?.password && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {state.errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label
                                    htmlFor="confirm"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Confirm Password
                                </label>
                                <input
                                    id="confirm"
                                    name="confirm"
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full rounded-md border text-gray-700 border-gray-300 p-2 focus:ring-2 focus:ring-[rgb(55,0,231)] outline-none"
                                />
                                {state.errors?.confirm && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {state.errors.confirm}
                                    </p>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full bg-[rgb(55,0,231)] hover:bg-[rgb(75,20,255)] text-white font-semibold py-2 rounded-md transition-all duration-200"
                            >
                                Register
                            </button>
                        </form>

                        {/* Success Message */}
                        {state.success && (
                            <p className="text-green-600 text-center mt-4 font-medium">
                                {state.message}
                            </p>
                        )}

                        <p className="text-center text-sm text-gray-600 mt-6">
                            Already have an account?{" "}
                            <a
                                href="/login"
                                className="text-[rgb(55,0,231)] hover:underline font-medium"
                            >
                                Login here
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
