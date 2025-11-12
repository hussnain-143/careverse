"use client";
import React, { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom"; // <-- NEW: Import useFormStatus for pending status

// --- 1. The Action Function ---
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

      // backend validation array errors
      if (Array.isArray(data.errors)) {
        data.errors.forEach((e) => {
          formatted[e.field] = e.message;
        });
      }

      // backend main message
      if (data.message) {
        formatted.api = data.message;
      }

      return { success: false, errors: formatted };
    }

    const { token } = data.data;

    // token store
    if (token) {
      // NOTE: Using localStorage/sessionStorage in the action function is generally fine in Next.js environments
      // if you cannot use a secure cookie strategy.
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");

      if (rememberMe) {
        localStorage.setItem("authToken", token);
      } else {
        sessionStorage.setItem("authToken", token);
      }
    }

    return { success: true, message: "Login successful!", errors: {} };
  } catch (e) {
    return { success: false, errors: { api: "Network error" } };
  }
}

// --- 2. Submit Button Component (to access loading state) ---
function LoginSubmitButton() {
  // Access the pending status of the parent form's action
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      // Use the 'pending' status from useFormStatus to disable and show loader
      disabled={pending}
      className={`w-full bg-[rgb(55,0,231)] cursor-pointer hover:bg-[rgb(75,20,255)] text-white font-semibold py-2 sm:py-3 rounded-md transition-all duration-200 text-sm sm:text-base flex items-center justify-center gap-2 ${
        pending ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {pending ? (
        <>
<div className="size-5 border border-white rounded-full border-b-transparent animate-spin"></div>
        </>
      ) : (
        "Login"
      )}
    </button>
  );
}

// --- 3. Main Page Component ---
export default function LoginPage() {
  const router = useRouter();

  const [state, formAction] = useActionState(loginAction, {
    success: null,
    errors: {},
    message: "",
  });

  if (state.success) {
    setTimeout(() => router.push("/"), 1200);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[rgb(120,195,235)] to-[rgb(180,159,216)] px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col max-w-[1200px] mx-auto min-h-screen">
        <div className="flex flex-1 flex-col gap-6 sm:gap-10 items-center justify-center">
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
              Login to your{" "}
              <span className="font-semibold text-[rgb(55,0,231)]">Careverse</span>{" "}
              account.
            </p>

            <form action={formAction} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full text-gray-700 rounded-md border border-gray-300 p-2 sm:p-3 focus:ring-2 focus:ring-[rgb(55,0,231)] outline-none text-sm sm:text-base"
                />
                {state.errors?.email && (
                  <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full text-gray-700 rounded-md border border-gray-300 p-2 sm:p-3 focus:ring-2 focus:ring-[rgb(55,0,231)] outline-none text-sm sm:text-base"
                />
                {state.errors?.password && (
                  <p className="text-red-500 text-sm mt-1">{state.errors.password}</p>
                )}
              </div>

              {/* Remember & Forgot */}
              <div className="flex flex-col sm:flex-row items-start justify-between gap-2 sm:gap-0 text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input
                    type="checkbox"
                    name="remember"
                    className="accent-[rgb(55,0,231)]"
                  />
                  Remember me
                </label>
                <a className="text-[rgb(55,0,231)] hover:underline font-medium">
                  Forgot Password?
                </a>
              </div>

              {/* Submit button using the new component */}
              <LoginSubmitButton />

              {/* API error */}
              {state.errors?.api && (
                <p className="text-red-500 text-sm text-center mt-2">
                  {state.errors.api}
                </p>
              )}

              {/* success */}
              {state.success && (
                <p className="text-green-600 text-center mt-3 font-medium">
                  {state.message}
                </p>
              )}
            </form>

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