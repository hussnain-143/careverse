"use client";
import React, { useActionState } from "react";
import { useRouter } from "next/navigation";

async function registerAction(prevState, formData) {
  const email = formData.get("email")?.trim();
  const password = formData.get("password")?.trim();
  const confirm = formData.get("confirm")?.trim();

  const errors = {};

  // validate
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
          email: email,
          password: password,
          rememberMe: false,
        }),
      }
    );

    const data = await res.json();

    // if backend send validation errors
   if (!res.ok) {
    if (data?.errors && Array.isArray(data.errors)) {
            const formatted = {};
            data.errors.forEach(err => {
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

export default function RegisterPage() {
  const router = useRouter();

  const [state, formAction] = useActionState(registerAction, {
    success: null,
    errors: {},
    message: "",
  });

   if (state.success) {
    setTimeout(() => {
      router.push("/login");
    }, 1000);
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
              Create an Account
            </h1>
            <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
              Join{" "}
              <span className="font-semibold text-[rgb(55,0,231)]">Careverse</span>{" "}
              to start your personalized health journey.
            </p>

            <form action={formAction} className="space-y-5 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full text-gray-700 rounded-md border border-gray-300 p-2 sm:p-3 text-sm sm:text-base focus:ring-2 focus:ring-[rgb(55,0,231)] outline-none"
                />
                {state.errors?.email && (
                  <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-md border text-gray-700 border-gray-300 p-2 sm:p-3 text-sm sm:text-base focus:ring-2 focus:ring-[rgb(55,0,231)] outline-none"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  name="confirm"
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-md border text-gray-700 border-gray-300 p-2 sm:p-3 text-sm sm:text-base focus:ring-2 focus:ring-[rgb(55,0,231)] outline-none"
                />
                {state.errors?.confirm && (
                  <p className="text-red-500 text-sm mt-1">{state.errors.confirm}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[rgb(55,0,231)] hover:bg-[rgb(75,20,255)] text-white font-semibold py-2 sm:py-3 rounded-md transition-all duration-200 text-sm sm:text-base"
              >
                Register
              </button>
            </form>

            {/* ---- API error ---- */}
            {state.errors?.api && (
              <p className="text-red-500 text-center mt-3 text-sm">{state.errors.api}</p>
            )}

            {/* ---- success ---- */}
            {state.success && (
              <p className="text-green-600 text-center mt-4 font-medium text-sm sm:text-base">
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
