"use client";
import React, { useEffect, useState } from "react";
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
import HomeFooter from "../components/home/footer";
import Loading from "../loading";
import { TokenManager } from "../src/utils/tokenUtils";

// Define the primary accent color
const PRIMARY_COLOR = "#4B14FF";

// --- Helper Component: Detail Card with Hover ---
const DetailCard = ({ icon: Icon, label, value }) => (
  // Subtle white background for contrast
  <div className="p-5 bg-white/95 rounded-xl shadow-xl border-l-4 border-[#4B14FF] transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
    <div className="flex items-center space-x-4">
      <Icon className="w-6 h-6 text-[#4B14FF] flex-shrink-0" /> 
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 uppercase tracking-widest">{label}</p>
        <p className="text-xl font-bold text-gray-900 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">{value || "N/A"}</p>
      </div>
    </div>
  </div>
);

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const tokens = TokenManager.getTokens();
    if (!tokens?.token) {
      router.push("/login");
      return;
    }

    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    setLoading(false);
  }, [router]);

  const handleGoBack = () => {
    router.back();
  };

  if (loading) return <Loading />;

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
    // Background gradient remains as requested
    <div className="min-h-screen bg-gradient-to-b from-[rgb(120,195,235)] to-[rgb(180,159,216)]">
      <div className="max-w-[1200px] mx-auto flex flex-col min-h-screen text-gray-900 px-4 sm:px-6 lg:px-8">
        <HomeHeader />

        <main className="flex-1 py-12 md:py-16">
          
          {/* Main Profile Panel - Fully Transparent Container */}
          <div className="bg-transparent shadow-2xl rounded-2xl p-6 md:p-10 lg:p-12">
            
            {/* --- Profile Header Section --- */}
            
            {/* 1. Back Button Row */}
            <div className="mb-4">
                <button
                    onClick={handleGoBack}
                    className="p-2 rounded-full text-[#4B14FF] hover:text-white  hover:bg-[#4B14FF]/30 cursor-pointer transition duration-150"
                    title="Go Back"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
            </div>

            {/* 2. Avatar and Name Block */}
            <div className="flex items-center space-x-6 pb-8 border-b border-white/40 mb-8">
                {/* Avatar using the accent color */}
                <div 
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 bg-white flex items-center justify-center flex-shrink-0 shadow-xl"
                    style={{ borderColor: PRIMARY_COLOR }}
                >
                    {initials ? (
                        <span 
                            className="text-4xl sm:text-5xl font-extrabold" 
                            style={{ color: PRIMARY_COLOR }}
                        >
                            {initials.toUpperCase()}
                        </span>
                    ) : (
                        <User className="w-12 h-12 sm:w-14 sm:h-14" style={{ color: PRIMARY_COLOR }} />
                    )}
                </div>
                
                <div className="text-left flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-4xl font-extrabold text-white truncate drop-shadow-lg">
                        {displayName}
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-200 font-light flex items-center space-x-2 mt-1 truncate">
                        <Mail className="w-5 h-5 text-[#4B14FF] flex-shrink-0" />
                        <span>{user?.email}</span>
                    </p>
                </div>
            </div>

            {/* --- Personal Details Grid --- */}
            <h2 className="text-2xl font-bold text-white mb-6 border-b pb-2 drop-shadow-sm" style={{ borderColor: PRIMARY_COLOR, borderBottomWidth: '2px' }}>Account Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DetailCard
                icon={Tag}
                label="First Name"
                value={user?.firstName}
              />
              <DetailCard
                icon={Tag}
                label="Last Name"
                value={user?.lastName}
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
              {/* Account Status Card - Highlighting the status with border and dot */}
              <div className={`p-5 bg-white/95 rounded-xl shadow-xl border-l-4 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] ${isActive ? 'border-green-500' : 'border-red-500'}`}>
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-widest">Account Status</p>
                    <p className="text-xl font-bold text-gray-900 mt-0.5">{isActive ? "Active" : "Disabled"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Medical History Section --- */}
            {user?.medicalHistory && user.medicalHistory.length > 0 && (
              <div className="mt-10 pt-8 border-t border-white/30">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2 drop-shadow-sm">
                  <HeartPulse className="w-6 h-6 text-pink-300" />
                  <span>Medical History</span>
                </h2>
                {/* Background for list items */}
                <div className="bg-white/95 p-6 rounded-xl border border-white/50 shadow-inner">
                  <ul className="list-disc ml-5 text-gray-700 space-y-2 text-base">
                    {user.medicalHistory.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </main>

        <HomeFooter />
      </div>
    </div>
  );
}