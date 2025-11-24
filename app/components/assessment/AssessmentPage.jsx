"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Star,
  Stethoscope,
  Brain,
  RefreshCcw,
  AlertTriangle,
  Info,
  AlertCircle,
  CheckCircle,
  Package,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { apiClient } from "../../src/utils/apiClient";
import Loading from "../../loading";

/* ────────────────────── Header ────────────────────── */
const Header = () => {
  const [assessments, setAssessments] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const hasLoadedRef = useRef(false);

  // Load assessments via apiClient
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const loadAssessments = async () => {
      try {
        const res = await apiClient.get("/api/v1/assessments");
        const { assessments } = res.data;
        setAssessments(assessments ?? []);
      } catch (err) {
        console.error("loadAssessments error:", err);
      }
    };

    loadAssessments();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent backdrop-blur-xl border-b border-white/40 flex-shrink-0">
      <div className="max-w-7xl mx-auto flex justify-between items-center pb-4 px-6 sm:px-8 pt-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[rgb(55,0,231)] to-[rgb(75,20,255)] rounded-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[rgb(55,0,231)] to-[rgb(75,20,255)] rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"></div>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-[rgb(55,0,231)] group-hover:to-[rgb(75,20,255)] transition-all duration-300">
              Careverse
            </h1>
        </Link>
        </div>

        <div className="flex items-center gap-3">
            <Link
              href="/"
            className="text-gray-800 hover:text-[rgb(55,0,231)] font-medium transition-all duration-200 relative group text-lg"
            >
              Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[rgb(55,0,231)] group-hover:w-full transition-all duration-300"></span>
            </Link>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-gray-800 hover:text-[rgb(55,0,231)] font-medium cursor-pointer transition-all duration-200 flex items-center gap-1 relative group text-lg"
              >
                My Assessments
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
              />
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[rgb(55,0,231)] group-hover:w-full transition-all duration-300"></span>
              </button>

              {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 overflow-hidden z-50 animate-fade-in">
                  {assessments.length === 0 ? (
                  <p className="px-4 py-3 text-base text-gray-600 font-medium">
                      No assessments yet.
                    </p>
                  ) : (
                  <ul className="max-h-80 overflow-y-auto scrollbar-thin">
                      {assessments.map((a) => (
                        <li key={a.id}>
                          <Link
                            href={`/assessment/${a.id}`}
                            onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-3 text-base text-gray-800 hover:bg-gradient-to-br hover:from-[rgb(55,0,231)]/10 hover:to-[rgb(75,20,255)]/10 transition-all duration-200 hover:text-[rgb(55,0,231)] font-medium"
                          >
                            {a.possibleCondition}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
        </div>
      </div>
    </header>
  );
};

/* ────────────────────── Provider Avatar ────────────────────── */
const ProviderAvatar = ({ initials }) => (
  <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-[rgb(55,0,231)]/20 to-[rgb(75,20,255)]/20 border border-white/60 shadow-lg overflow-hidden flex-shrink-0">
    <div className="absolute inset-0 bg-gradient-to-br from-[rgb(55,0,231)]/10 to-[rgb(75,20,255)]/10 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
    <img
      src={`https://placehold.co/100x100/A0BFFF/3D28E8/png?text=${initials}`}
      alt="avatar"
      className="w-full h-full object-cover p-1 relative z-10"
      onError={(e) => {
        e.currentTarget.src =
          "https://placehold.co/100x100/A0BFFF/3D28E8/png?text=D";
      }}
    />
  </div>
);

/* ────────────────────── Assessment Results Page ────────────────────── */
export default function AssessmentResults() {
  const router = useRouter();
  const data = useSelector((state) => state.data.apiData);
  const [loc, setLoc] = useState([]);
  const [activeTab, setActiveTab] = useState("Overview");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const locationFetchedRef = useRef(false);

  // Redirect if no data
  useEffect(() => {
    if (!data) {
      router.push("/chat");
      return;
    }
  }, [data, router]);

  // Fetch location only once when data is available
  useEffect(() => {
    if (!data) {
      setIsInitialLoad(false);
      return;
    }
    
    if (locationFetchedRef.current) {
      setIsInitialLoad(false);
      return;
    }

    const fetchLocation = async () => {
      try {
        locationFetchedRef.current = true;
        const res = await apiClient.get("/api/v1/users/location");
        const { location } = res.data;
        setLoc(location ?? []);
      } catch (err) {
        console.error("getLocation error:", err);
        locationFetchedRef.current = false;
      } finally {
        setIsInitialLoad(false);
      }
    };

    fetchLocation();
  }, [data]);

  // Show loading during initial load
  if (!data || isInitialLoad) {
    return <Loading message="Loading assessment..." />;
  }

  const {
    possibleCondition,
    disclaimer,
    severity,
    warnings,
    nextSteps,
    providers,
    products,
  } = data.data;

  const conditionName = possibleCondition?.name;
  const conditionDesc = possibleCondition?.description;
  const triggers = possibleCondition?.commonTriggers;
  const initialSelfCare = possibleCondition?.initialSelfCare;

  const iconMap = {
    emergency: <AlertTriangle className="w-6 h-6 text-[rgb(55,0,231)]" />,
    doctor: <Stethoscope className="w-6 h-6 text-[rgb(55,0,231)]" />,
    info: <Info className="w-6 h-6 text-[rgb(55,0,231)]" />,
  };

  const severityColor = {
    emergency: "bg-red-100 text-red-700",
    high: "bg-orange-100 text-orange-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-green-100 text-green-700",
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="flex flex-col min-h-screen text-gray-800 relative bg-gradient-to-br from-[rgb(120,195,235)] via-[rgb(150,177,225)] to-[rgb(180,159,216)]">
      <Header />

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

          <div className="max-w-6xl mx-auto text-left mb-8 sm:mb-12 relative z-10 animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2 bg-gradient-to-r from-[rgb(55,0,231)] to-[rgb(75,20,255)] bg-clip-text text-transparent">
            Your Assessment Results
          </h1>
            <p className="text-gray-800 text-sm sm:text-base font-medium">
            Based on the symptoms you described.
          </p>
        </div>

        {/* Assessment Result Card*/}
        <section className="max-w-6xl mx-auto mb-10 sm:mb-12 relative z-10 animate-fade-in-up delay-100">
          <div className="relative">
            {/* Main Card */}
            <div className="bg-white/85 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
              {/* Top Gradient Accent */}
              <div className="h-2 bg-gradient-to-r from-[rgb(55,0,231)] via-[rgb(75,20,255)] to-[rgb(55,0,231)]"></div>
              
              <div className="p-8 sm:p-10">
                {/* Header Section */}
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
                              Assessment Result
                            </p>
                          </div>
                        </div>
                        
                        {/* Title with Icon */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-[rgb(55,0,231)]/15 to-[rgb(75,20,255)]/15 border border-[rgb(55,0,231)]/25 shadow-md">
                            <Brain className="w-6 h-6 text-[rgb(55,0,231)]" />
                          </div>
                          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                            {conditionName}
                          </h2>
                        </div>
                        
                        {/* Severity Badge */}
                        {severity && (
                          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase shadow-sm ${severityColor[severity]}`}>
                            {severity === "emergency" && <AlertTriangle className="w-4 h-4" />}
                            {severity === "high" && <AlertCircle className="w-4 h-4" />}
                            {severity === "medium" && <Info className="w-4 h-4" />}
                            {severity === "low" && <CheckCircle className="w-4 h-4" />}
                            {severity} Severity
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Icon Display */}
                  <div className="hidden lg:flex flex-shrink-0 ml-8 items-center justify-center">
                    <div className="relative">
                      {/* Icon with Animation */}
                      <div className="relative">
              {severity === "emergency" && (
                          <AlertTriangle className="w-28 h-28 text-red-500 drop-shadow-2xl animate-pulse" style={{ filter: "drop-shadow(0 0 20px rgba(239, 68, 68, 0.6))" }} />
              )}
              {severity === "high" && (
                          <AlertCircle className="w-28 h-28 text-orange-500 drop-shadow-2xl animate-bounce" style={{ filter: "drop-shadow(0 0 20px rgba(249, 115, 22, 0.6))" }} />
              )}
              {severity === "medium" && (
                          <Info className="w-28 h-28 text-yellow-500 drop-shadow-2xl animate-pulse" style={{ filter: "drop-shadow(0 0 20px rgba(234, 179, 8, 0.6))" }} />
              )}
              {severity === "low" && (
                          <CheckCircle className="w-28 h-28 text-green-500 drop-shadow-2xl" style={{ filter: "drop-shadow(0 0 20px rgba(34, 197, 94, 0.6))", animation: "float 3s ease-in-out infinite" }} />
                        )}
                      </div>
                    </div>
                  </div>
            </div>

                {/* Description */}
                <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-[rgb(55,0,231)]/5 to-[rgb(75,20,255)]/5 border border-[rgb(55,0,231)]/10">
                  <p className="text-gray-800 text-base sm:text-lg leading-relaxed">
                    {conditionDesc}
                  </p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/60 hover:border-[rgb(55,0,231)]/30 transition-all duration-300 hover:shadow-lg group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[rgb(55,0,231)]/15 to-[rgb(75,20,255)]/15 group-hover:from-[rgb(55,0,231)]/25 group-hover:to-[rgb(75,20,255)]/25 transition-all duration-300">
                        <AlertCircle className="w-5 h-5 text-[rgb(55,0,231)]" />
                </div>
                      <h3 className="font-bold text-gray-900 text-lg">
                    Common Triggers
                  </h3>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed pl-14">
                    {triggers?.join(", ")}
                  </p>
                </div>
                  
                  <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/60 hover:border-[rgb(55,0,231)]/30 transition-all duration-300 hover:shadow-lg group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[rgb(55,0,231)]/15 to-[rgb(75,20,255)]/15 group-hover:from-[rgb(55,0,231)]/25 group-hover:to-[rgb(75,20,255)]/25 transition-all duration-300">
                        <CheckCircle className="w-5 h-5 text-[rgb(55,0,231)]" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg">
                    Initial Self-Care
                  </h3>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed pl-14">
                    {initialSelfCare?.join(", ")}
                  </p>
                </div>
              </div>

                {/* Disclaimer */}
              {disclaimer && (
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50/90 to-amber-50/70 backdrop-blur-sm border-2 border-amber-300/40 shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-amber-100/80 flex-shrink-0">
                        <Info className="w-6 h-6 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-amber-900 mb-2 text-sm uppercase tracking-wide">
                          Important Disclaimer
                        </p>
                        <p className="text-amber-800 text-sm leading-relaxed">
                    {disclaimer}
                  </p>
                      </div>
                    </div>
                </div>
              )}
              </div>
            </div>
          
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-gradient-to-br from-[rgb(55,0,231)]/10 to-[rgb(75,20,255)]/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-gradient-to-tr from-[rgb(55,0,231)]/10 to-[rgb(75,20,255)]/10 rounded-full blur-3xl -z-10"></div>
          </div>
        </section>

        {/* Suggested Next Steps */}
        <section className="max-w-6xl mx-auto mb-10 sm:mb-12 relative z-10 animate-fade-in-up delay-200">
          {/* Section Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgb(55,0,231)]/30 to-transparent"></div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Suggested Next Steps
          </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[rgb(55,0,231)]/30 to-transparent"></div>
            </div>
            <p className="text-center text-gray-600 text-sm">
              Recommended actions based on your assessment
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(nextSteps ?? []).map((item, i) => {
              const icon = iconMap[item.icon] || (
                <Info className="w-6 h-6 text-[rgb(55,0,231)]" />
              );

              return (
                <div
                  key={i}
                  onClick={() => item.url && window.open(item.url, "_blank")}
                  className="group relative bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/60 flex flex-col hover:shadow-2xl hover:border-[rgb(55,0,231)]/40 transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[rgb(55,0,231)]/5 to-[rgb(75,20,255)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[rgb(55,0,231)] via-[rgb(75,20,255)] to-[rgb(55,0,231)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-[rgb(55,0,231)]/15 to-[rgb(75,20,255)]/15 border border-[rgb(55,0,231)]/20 group-hover:from-[rgb(55,0,231)]/25 group-hover:to-[rgb(75,20,255)]/25 group-hover:border-[rgb(55,0,231)]/30 transition-all duration-300 w-fit">
                    {icon}
                  </div>
                    
                    {/* Title */}
                    <h4 className="font-bold mb-2 text-lg text-gray-900 group-hover:text-[rgb(55,0,231)] transition-colors duration-300">
                    {item.title}
                  </h4>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {item.description}
                    </p>
                    
                    {item.url && (
                      <div className="mt-4 flex items-center gap-2 text-[rgb(55,0,231)] text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>Learn more</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Providers & Map */}
        <section className="max-w-6xl mx-auto mb-12 sm:mb-16 relative z-10 animate-fade-in-up delay-300">
          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex gap-2 bg-white/60 backdrop-blur-sm p-1.5 rounded-xl border border-white/60 shadow-lg">
              {["Overview", "Providers", "Products"].map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      relative px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer
                      ${
                        isActive
                          ? "bg-gradient-to-r from-[rgb(55,0,231)] to-[rgb(75,20,255)] text-white shadow-md scale-105"
                          : "text-gray-700 hover:text-[rgb(55,0,231)] hover:bg-white/40 active:scale-95"
                      }
                    `}
                    aria-label={`Switch to ${tab} tab`}
                    aria-pressed={isActive}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Location - Simple */}
            {loc?.city && loc?.countryCode && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/60 backdrop-blur-sm border border-white/60">
                <MapPin className="w-4 h-4 text-[rgb(55,0,231)]" />
                <span className="text-xs sm:text-sm text-gray-700">
                  <span className="font-medium">My Location: </span>
                  <span className="font-semibold text-[rgb(55,0,231)]">
                  {loc.city}, {loc.countryCode}
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Tab Content */}

          {/* OVERVIEW TAB */}
          {activeTab === "Overview" && (
            <section className="mt-8 animate-fade-in-up">
              {warnings.length > 0 ? (
                <div className="space-y-4">
                  {warnings.map((w, i) => (
                    <div
                      key={i}
                      className="bg-white/90 backdrop-blur-xl border-l-4 border-red-500 rounded-r-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-red-100 flex-shrink-0">
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        </div>
                      <div className="flex-1">
                          <p className="font-bold text-gray-900 mb-2">
                          {w.message}
                        </p>
                        {w.action && (
                            <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
                              <p className="text-sm font-semibold text-red-800 mb-1">
                                Recommended Action:
                              </p>
                              <p className="text-sm text-red-700">
                                {w.action}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-10 text-center shadow-lg border border-white/60">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <p className="text-xl font-bold text-gray-900 mb-2">
                    All systems operational
                  </p>
                  <p className="text-sm text-gray-600">
                    No warnings or alerts at this time.
                  </p>
                </div>
              )}
            </section>
          )}

          {/* PROVIDERS TAB */}
          {activeTab === "Providers" && (
            <section className="mt-8 animate-fade-in-up">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Map */}
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/60 h-64 sm:h-72 lg:h-80">
                  <img
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${loc.city},${loc.countryCode}&zoom=11&size=600x400&markers=color:red|${loc.city},${loc.countryCode}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`}
                    alt="Map"
                    className="w-full h-full object-cover block"
                  />
                </div>
                
                {/* Providers List */}
                <div className="flex flex-col gap-4">
                  {providers.map((doc) => (
                    <div
                      key={doc.placeId || doc.name}
                      className="bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-lg border border-white/60 hover:shadow-2xl hover:border-[rgb(55,0,231)]/40 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-4">
                        <ProviderAvatar
                          initials={doc.initials || getInitials(doc.name)}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 mb-1">
                            {doc.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-1">
                            {doc.specialty} · {doc.distance}
                          </p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs text-gray-600">
                            {doc.rating} ({doc.reviewCount} reviews)
                            </span>
                          </div>
                      </div>
                      {doc?.bookingUrl ? (
                        <Link
                          href={doc.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                            className="bg-gradient-to-r from-[rgb(55,0,231)] to-[rgb(75,20,255)] hover:from-[rgb(75,20,255)] hover:to-[rgb(55,0,231)] text-white px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 whitespace-nowrap"
                        >
                            Book
                        </Link>
                      ) : (
                        <button
                          disabled
                            className="bg-gray-200 text-gray-500 px-5 py-2 rounded-full text-sm font-semibold cursor-not-allowed whitespace-nowrap"
                        >
                            Unavailable
                        </button>
                      )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === "Products" && (
            <section className="mt-8 animate-fade-in-up">
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((p, i) => (
                    <div
                      key={i}
                      className="group relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 p-6 hover:shadow-2xl hover:border-[rgb(55,0,231)]/40 transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                    >
                      {/* Top accent line */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[rgb(55,0,231)] via-[rgb(75,20,255)] to-[rgb(55,0,231)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[rgb(55,0,231)]/5 to-[rgb(75,20,255)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Icon */}
                      <div className="relative z-10 bg-gradient-to-br from-[rgb(55,0,231)] to-[rgb(75,20,255)] rounded-xl w-14 h-14 flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Package className="w-7 h-7" />
                      </div>

                      {/* Product Name & Type */}
                      <h4 className="relative z-10 font-bold text-lg text-gray-900 group-hover:text-[rgb(55,0,231)] transition-colors duration-300 mb-1">
                        {p.name}
                      </h4>
                      <p className="relative z-10 text-xs font-semibold text-[rgb(55,0,231)] uppercase tracking-wide mb-3">
                        {p.type}
                      </p>

                      {/* Description */}
                      <p className="relative z-10 text-sm text-gray-700 leading-relaxed mb-4">
                        {p.description}
                      </p>

                      {/* Prescription / Consultation Tags */}
                      <div className="relative z-10 flex flex-wrap gap-2 mb-4">
                        {p.isPrescription ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                            Prescription Required
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                            Over the Counter
                          </span>
                        )}
                        {p.requiresConsultation && (
                          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            Consultation Suggested
                          </span>
                        )}
                      </div>

                      {/* Disclaimer */}
                      {p.disclaimer && (
                        <p className="relative z-10 text-xs text-gray-500 italic mb-4">
                        {p.disclaimer}
                      </p>
                      )}

                      {/* CTA Link */}
                      <div className="relative z-10 mt-auto pt-4 border-t border-gray-200">
                        <Link
                          href={p.purchaseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[rgb(55,0,231)] to-[rgb(75,20,255)] hover:from-[rgb(75,20,255)] hover:to-[rgb(55,0,231)] text-white text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                        >
                          Buy Now
                          <svg
                            className="w-4 h-4 transition-transform group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl p-12 text-center shadow-lg">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-bold text-gray-900 mb-2">
                    No products available
                  </p>
                  <p className="text-sm text-gray-600">
                    Check back later for updates.
                  </p>
                </div>
              )}
            </section>
          )}
        </section>

        {/* CTA Section */}
        <section className="max-w-6xl mx-auto mb-10 relative z-10 animate-fade-in-up delay-400">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 bg-white/90 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg">
           
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                Want to explore other possibilities?
              </h3>
              <p className="text-sm text-gray-600">
                Continue your health journey
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/chat"
                className="group px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 text-sm bg-white text-[rgb(55,0,231)] border border-[rgb(55,0,231)]/30 hover:bg-[rgb(55,0,231)] hover:text-white hover:border-[rgb(55,0,231)] flex items-center justify-center gap-2 shadow-sm hover:shadow-lg hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[rgb(55,0,231)] focus:ring-offset-2"
                aria-label="Refine your assessment results"
              >
                <Brain className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                Refine Results
              </Link>

              <Link
                className="group px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm bg-gradient-to-r from-[rgb(55,0,231)] to-[rgb(75,20,255)] hover:from-[rgb(75,20,255)] hover:to-[rgb(55,0,231)] text-white shadow-md hover:shadow-xl hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[rgb(55,0,231)] focus:ring-offset-2"
                href="/"
                aria-label="Start a new assessment"
              >
                <RefreshCcw className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                New Assessment
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
