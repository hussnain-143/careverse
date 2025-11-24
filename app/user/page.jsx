"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Tag, 
  Briefcase, 
  HeartPulse,
  ArrowLeft 
} from "lucide-react"; 
import HomeHeader from "../components/home/header";
import Loading from "../loading";
import { TokenManager } from "../src/utils/tokenUtils";

// --- Helper Component: Detail Card ---
const DetailCard = ({ icon: Icon, label, value }) => (
  <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/60 hover:border-[rgb(55,0,231)]/30 transition-all duration-300 hover:shadow-lg group">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-3 rounded-xl bg-gradient-to-br from-[rgb(55,0,231)]/15 to-[rgb(75,20,255)]/15 group-hover:from-[rgb(55,0,231)]/25 group-hover:to-[rgb(75,20,255)]/25 transition-all duration-300">
        <Icon className="w-5 h-5 text-[rgb(55,0,231)]" />
      </div>
      <h3 className="font-bold text-gray-900 text-lg">
        {label}
      </h3>
    </div>
    <p className="text-gray-700 text-sm leading-relaxed pl-14">
      {value || "N/A"}
    </p>
  </div>
);

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Prevent double execution in StrictMode
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const loadUser = () => {
      const tokens = TokenManager.getTokens();
      if (!tokens?.token) {
        router.push("/login");
        return;
      }

      // Check if user data exists in storage (fast - no loading needed)
      const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setLoading(false);
        } catch (err) {
          console.error("Error parsing user data:", err);
          setLoading(false);
        }
      } else {
        // Only show loading if no user data exists
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const handleGoBack = () => {
    // Smooth navigation with fallback
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  // Only show loading if we're actually waiting for critical data
  if (loading && !user) return <Loading message="Loading profile..." />;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-600">
        <p className="text-lg">User data not found. Redirecting...</p>
      </div>
    );
  }

  const displayName = user?.firstName || user?.email || "User Profile";
  const initials = (user?.firstName?.[0] || '') + (user?.lastName?.[0] || '');
  const isActive = user?.isActive;

  return (
    <div className="flex flex-col min-h-screen text-gray-800 relative bg-gradient-to-br from-[rgb(120,195,235)] via-[rgb(150,177,225)] to-[rgb(180,159,216)]">
      <HomeHeader />

      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8 sm:py-12 relative overflow-hidden">
        {/* Animated background elements */}
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

        {/* Page Title */}
        <div className="max-w-6xl mx-auto text-left mb-8 sm:mb-12 relative z-10 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2 bg-gradient-to-r from-[rgb(55,0,231)] to-[rgb(75,20,255)] bg-clip-text text-transparent">
            User Profile
          </h1>
          <p className="text-gray-800 text-sm sm:text-base font-medium">
            Your account information and details
          </p>
        </div>

        {/* Main Profile Card - Matching Assessment Page */}
        <section className="max-w-6xl mx-auto mb-10 sm:mb-12 relative z-10 animate-fade-in-up delay-100">
          <div className="relative">
            {/* Main Card */}
            <div className="bg-white/85 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
              {/* Top Gradient Accent */}
              <div className="h-2 bg-gradient-to-r from-[rgb(55,0,231)] via-[rgb(75,20,255)] to-[rgb(55,0,231)]"></div>
              
              <div className="p-8 sm:p-10">
                {/* Back Button */}
                <div className="mb-6">
                  <button
                    onClick={handleGoBack}
                    className="p-2 rounded-lg text-gray-700 hover:text-[rgb(55,0,231)] hover:bg-[rgb(55,0,231)]/10 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[rgb(55,0,231)] focus:ring-offset-2"
                    title="Go Back"
                    aria-label="Go back to previous page"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                </div>

                {/* Profile Header Section */}
                <div className="flex items-start justify-between mb-8">
                  <div className="flex-1">
                    {/* Title Section with Icon */}
                    <div className="relative">
                      {/* Background accent */}
                      <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[rgb(55,0,231)] to-[rgb(75,20,255)] rounded-full"></div>
                      
                      <div className="pl-6">
                        {/* Label */}
                        <div className="mb-3">
                          <div className="inline-flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[rgb(55,0,231)]"></div>
                            <p className="text-xs font-bold uppercase tracking-widest text-[rgb(55,0,231)]">
                              User Profile
                            </p>
                          </div>
                        </div>
                        
                        {/* Title with Icon */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-[rgb(55,0,231)]/15 to-[rgb(75,20,255)]/15 border border-[rgb(55,0,231)]/25 shadow-md">
                            <User className="w-6 h-6 text-[rgb(55,0,231)]" />
                          </div>
                          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                            {displayName}
                          </h2>
                        </div>
                        
                        {/* Email Badge */}
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-[rgb(55,0,231)]/5 to-[rgb(75,20,255)]/5 border border-[rgb(55,0,231)]/10 w-fit">
                          <Mail className="w-4 h-4 text-[rgb(55,0,231)]" />
                          <span className="text-sm text-gray-700 font-medium">{user?.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Icon Display */}
                  <div className="hidden lg:flex flex-shrink-0 ml-8 items-center justify-center">
                    <div className="relative">
                      <User className="w-28 h-28 text-[rgb(55,0,231)] drop-shadow-2xl" style={{ filter: "drop-shadow(0 0 20px rgba(55, 0, 231, 0.3))" }} />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-[rgb(55,0,231)]/5 to-[rgb(75,20,255)]/5 border border-[rgb(55,0,231)]/10">
                  <p className="text-gray-800 text-base sm:text-lg leading-relaxed">
                    View and manage your account information, personal details, and preferences.
                  </p>
                </div>

                {/* Account Details Section */}
                <div className="mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Account Details</h3>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <DetailCard
                      icon={User}
                      label="Full Name"
                      value={user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName || user?.lastName || "N/A"}
                    />
                    <DetailCard
                      icon={Briefcase}
                      label="Gender"
                      value={user?.gender}
                    />
                    <DetailCard
                      icon={Phone}
                      label="Phone Number"
                      value={user?.phone}
                    />
                    <DetailCard
                      icon={MapPin}
                      label="Location"
                      value={user?.location ? `${user.location.city}, ${user.location.country}` : "Global"}
                    />
                  </div>

                  {/* Account Status Card */}
                  <div className={`p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/60 hover:border-[rgb(55,0,231)]/30 transition-all duration-300 hover:shadow-lg ${isActive ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-xl ${isActive ? 'bg-green-100' : 'bg-red-100'}`}>
                        <div className={`w-5 h-5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        Account Status
                      </h3>
                    </div>
                    <p className={`text-gray-700 text-sm leading-relaxed pl-14 font-semibold ${isActive ? 'text-green-700' : 'text-red-700'}`}>
                      {isActive ? "Active" : "Disabled"}
                    </p>
                  </div>
                </div>

                {/* Medical History Section */}
                {user?.medicalHistory && user.medicalHistory.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-gray-100">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-pink-100 to-rose-100">
                        <HeartPulse className="w-5 h-5 text-pink-600" />
                      </div>
                      <span>Medical History</span>
                    </h3>
                    <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-lg">
                      <ul className="list-disc ml-5 text-gray-700 space-y-2 text-sm sm:text-base">
                        {user.medicalHistory.map((item, index) => (
                          <li key={index} className="leading-relaxed">{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}