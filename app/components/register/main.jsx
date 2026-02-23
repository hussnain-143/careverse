"use client";
import React, { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { ArrowRight } from "lucide-react";
import Toast from "../common/Toast";

// --- Action Function ---
async function registerAction(prevState, formData) {
  const firstName = formData.get("firstName")?.trim();
  const lastName = formData.get("lastName")?.trim();
  const gender = formData.get("gender")?.trim();
  const phoneNumber = formData.get("phoneNumber")?.trim();
  const email = formData.get("email")?.trim();
  const password = formData.get("password")?.trim();
  const confirm = formData.get("confirm")?.trim();

  const errors = {};

  // validate
  if (!firstName || firstName.length < 2) {
    errors.firstName = "First name must be at least 2 characters.";
  }
  if (!lastName || lastName.length < 2) {
    errors.lastName = "Last name must be at least 2 characters.";
  }
  if (!gender) {
    errors.gender = "Please select a gender.";
  }
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
  if (!phoneNumber || !phoneRegex.test(phoneNumber.replace(/\s/g, ""))) {
    errors.phoneNumber = "Please enter a valid phone number.";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!password || password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }
  if (password !== confirm) {
    errors.confirm = "Passwords do not match.";
  }

  if (Object.keys(errors).length > 0) return { success: false, errors };

  // API call
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          firstName,
          lastName,
          gender,
          phoneNumber,
          email, 
          password, 
          rememberMe: false 
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      if (data?.errors && Array.isArray(data.errors)) {
        const formatted = {};
        data.errors.forEach((err) => {
          formatted[err.field] = err.message;
        });
        return { success: false, errors: formatted };
      }

      return {
        success: false,
        errors: { api: data?.message || "Something went wrong" },
      };
    }

    return {
      success: true,
      message: "Account created successfully!",
      errors: {},
    };
  } catch (e) {
    return {
      success: false,
      errors: { api: "Network error, try again later" },
    };
  }
}

// ---  Submit Button Component ---
function RegisterSubmitButton() {
  const { pending } = useFormStatus(); 

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full bg-gradient-to-r from-[rgb(55,0,231)] to-[rgb(75,20,255)] cursor-pointer hover:from-[rgb(75,20,255)] hover:to-[rgb(55,0,231)] text-white font-semibold py-3 px-6 sm:px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 ${
        pending ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {pending ? (
        <div className="size-5 border-2 border-white rounded-full border-b-transparent animate-spin"></div>
      ) : (
        <>
          Register
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}

// --- Main Page Component ---
export default function RegisterPage() {
  const router = useRouter();
  const [toast, setToast] = useState(null);
  const lastToastRef = useRef(null);

  const [state, formAction] = useActionState(registerAction, {
    success: null,
    errors: {},
    message: "",
  });

  // Show toast notifications
  useEffect(() => {
    const nextMessage =
      state.success && state.message ? state.message : state.errors?.api;
    const nextType = state.success && state.message ? "success" : "error";

    if (!nextMessage) return;
    if (lastToastRef.current === nextMessage) return;
    lastToastRef.current = nextMessage;

    // Defer state update to avoid synchronous setState-in-effect lint rule
    setTimeout(() => setToast({ message: nextMessage, type: nextType }), 0);

    if (state.success && state.message) {
      setTimeout(() => router.push("/login"), 1500);
    }
  }, [state, router]);

  const closeToast = () => {
    setToast(null);
  };

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-[rgb(120,195,235)] via-[rgb(150,177,225)] to-[rgb(180,159,216)] relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[rgb(55,0,231)]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[rgb(75,20,255)]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[rgb(120,195,235)]/20 rounded-full blur-3xl"></div>
        </div>

        <div className="flex flex-col max-w-[1400px] mx-auto min-h-screen px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-1 flex-col gap-8 sm:gap-10 items-center justify-center py-12">
            {/* Logo */}
            <div className="text-center animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-[rgb(55,0,231)] to-[rgb(75,20,255)] rounded-xl shadow-lg"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-[rgb(55,0,231)] to-[rgb(75,20,255)] rounded-xl opacity-0 blur-md"></div>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Careverse
            </h2>
              </div>
          </div>

            {/* Register Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 sm:p-10 w-full max-w-lg animate-fade-in-up delay-100">
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Create an Account
            </h1>
                <p className="text-gray-600 text-sm sm:text-base">
              Join <span className="font-semibold text-[rgb(55,0,231)]">Careverse</span> to start your personalized health journey.
            </p>
              </div>

              <form action={formAction} className="space-y-5">
                {/* First Name and Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      First Name
                    </label>
                    <input
                      name="firstName"
                      type="text"
                      placeholder="John"
                      className="w-full text-gray-800 bg-white/60 backdrop-blur-sm rounded-xl border border-white/60 focus:border-[rgb(55,0,231)]/50 focus:ring-2 focus:ring-[rgb(55,0,231)]/20 p-3 sm:p-3.5 outline-none text-sm sm:text-base transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
                    />
                    {state.errors?.firstName && (
                      <p className="text-red-500 text-sm mt-2 font-medium">{state.errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Last Name
                    </label>
                    <input
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      className="w-full text-gray-800 bg-white/60 backdrop-blur-sm rounded-xl border border-white/60 focus:border-[rgb(55,0,231)]/50 focus:ring-2 focus:ring-[rgb(55,0,231)]/20 p-3 sm:p-3.5 outline-none text-sm sm:text-base transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
                    />
                    {state.errors?.lastName && (
                      <p className="text-red-500 text-sm mt-2 font-medium">{state.errors.lastName}</p>
                    )}
                  </div>
                </div>
              
              {/* Email */}
              <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Email address
                  </label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                    className="w-full text-gray-800 bg-white/60 backdrop-blur-sm rounded-xl border border-white/60 focus:border-[rgb(55,0,231)]/50 focus:ring-2 focus:ring-[rgb(55,0,231)]/20 p-3 sm:p-3.5 outline-none text-sm sm:text-base transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
                />
                {state.errors?.email && (
                    <p className="text-red-500 text-sm mt-2 font-medium">{state.errors.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Phone Number
                  </label>
                  <input
                    name="phoneNumber"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="w-full text-gray-800 bg-white/60 backdrop-blur-sm rounded-xl border border-white/60 focus:border-[rgb(55,0,231)]/50 focus:ring-2 focus:ring-[rgb(55,0,231)]/20 p-3 sm:p-3.5 outline-none text-sm sm:text-base transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
                  />
                  {state.errors?.phoneNumber && (
                    <p className="text-red-500 text-sm mt-2 font-medium">{state.errors.phoneNumber}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Gender
                  </label>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        className="sr-only peer"
                      />
                     
                      <div className="relative w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-[rgb(55,0,231)] transition-all duration-300 flex items-center justify-center bg-white group-hover:border-[rgb(55,0,231)]/50">
                        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[rgb(55,0,231)] to-[rgb(75,20,255)] scale-0 peer-checked:scale-100 transition-transform duration-300"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-800 peer-checked:text-[rgb(55,0,231)] transition-colors duration-300">Male</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        className="sr-only peer"
                      />
                    
                      <div className="relative w-5 h-5 rounded-full border-2 border-gray-300 peer-checked:border-[rgb(55,0,231)] transition-all duration-300 flex items-center justify-center bg-white group-hover:border-[rgb(55,0,231)]/50">
                        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[rgb(55,0,231)] to-[rgb(75,20,255)] scale-0 peer-checked:scale-100 transition-transform duration-300"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-800 peer-checked:text-[rgb(55,0,231)] transition-colors duration-300">Female</span>
                    </label>
                  </div>
                  {state.errors?.gender && (
                    <p className="text-red-500 text-sm mt-2 font-medium">{state.errors.gender}</p>
                )}
              </div>

              {/* Password */}
              <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Password
                  </label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                    className="w-full text-gray-800 bg-white/60 backdrop-blur-sm rounded-xl border border-white/60 focus:border-[rgb(55,0,231)]/50 focus:ring-2 focus:ring-[rgb(55,0,231)]/20 p-3 sm:p-3.5 outline-none text-sm sm:text-base transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
                />
                  <p className="text-xs text-gray-500 mt-2">Must be at least 8 characters long.</p>
                {state.errors?.password && (
                    <p className="text-red-500 text-sm mt-2 font-medium">{state.errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Confirm Password
                  </label>
                <input
                  name="confirm"
                  type="password"
                  placeholder="••••••••"
                    className="w-full text-gray-800 bg-white/60 backdrop-blur-sm rounded-xl border border-white/60 focus:border-[rgb(55,0,231)]/50 focus:ring-2 focus:ring-[rgb(55,0,231)]/20 p-3 sm:p-3.5 outline-none text-sm sm:text-base transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
                />
                {state.errors?.confirm && (
                    <p className="text-red-500 text-sm mt-2 font-medium">{state.errors.confirm}</p>
                )}
              </div>

                {/* Submit button */}
                <div className="pt-2">
              <RegisterSubmitButton />
                </div>
            </form>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-[rgb(55,0,231)] hover:text-[rgb(75,20,255)] font-semibold hover:underline transition-colors duration-200"
                  >
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
      </div>
    </>
  );
}