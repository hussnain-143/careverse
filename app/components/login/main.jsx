"use client";
import React, { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { ArrowRight } from "lucide-react";
import { TokenManager } from "../../src/utils/tokenUtils";
import Toast from "../common/Toast";

// --- The Action Function ---
async function loginAction(prevState, formData) {
  const email = formData.get("email")?.trim();
  const password = formData.get("password")?.trim();
  const rememberMe = formData.get("remember") === "on";

  const errors = {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  }

  if (Object.keys(errors).length > 0) return { success: false, errors };

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      let formatted = {};

      if (Array.isArray(data.errors)) {
        data.errors.forEach((e) => {
          formatted[e.field] = e.message;
        });
      }

      if (data.message) {
        formatted.api = data.message;
      }

      return { success: false, errors: formatted };
    }

    const { token, refreshToken , user } = data.data;

    if (user){
        localStorage.setItem("user", JSON.stringify(user));
    }
    
    // Use TokenManager to store tokens
    if (token && refreshToken) {
      TokenManager.setTokens(token, refreshToken, rememberMe);
    }

    return { success: true, message: "Login successful!", errors: {} };
  } catch (e) {
    console.log(e)
    return { success: false, errors: { api: "Network error" } };
  }
}

// --- Submit Button Component ---
function LoginSubmitButton() {
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
          Login
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}

// --- Main Page Component ---
export default function LoginPage() {
  const router = useRouter();
  const [toast, setToast] = useState(null);
  const lastToastRef = useRef(null);

  const [state, formAction] = useActionState(loginAction, {
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
      setTimeout(() => router.push("/"), 1500);
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

          {/* Login Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 sm:p-10 w-full max-w-md animate-fade-in-up delay-100">
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
              <p className="text-gray-600 text-sm sm:text-base">
              Login to your{" "}
              <span className="font-semibold text-[rgb(55,0,231)]">Careverse</span>{" "}
                account
            </p>
            </div>

            <form action={formAction} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Email
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
                {state.errors?.password && (
                  <p className="text-red-500 text-sm mt-2 font-medium">{state.errors.password}</p>
                )}
              </div>

              {/* Remember & Forgot */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-0 text-sm">
                <label className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
                  <input
                    type="checkbox"
                    name="remember"
                    className="w-4 h-4 accent-[rgb(55,0,231)] rounded border-gray-300 focus:ring-2 focus:ring-[rgb(55,0,231)]/20"
                  />
                  <span>Remember me</span>
                </label>
              </div>

              {/* Submit button */}
              <div className="pt-2">
              <LoginSubmitButton />
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                {"Don't have an account? "}
              <a
                href="/register"
                  className="text-[rgb(55,0,231)] hover:text-[rgb(75,20,255)] font-semibold hover:underline transition-colors duration-200"
              >
                Register here
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