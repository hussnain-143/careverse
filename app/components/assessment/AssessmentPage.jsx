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
} from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { apiClient } from "../../src/utils/apiClient";

/* ────────────────────── Header ────────────────────── */
const Header = () => {
  const [assessments, setAssessments] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Load assessments via apiClient
  useEffect(() => {
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

  // Close dropdown when clicking outside
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
    <header className="fixed inset-x-0 top-0 bg-white border-b border-gray-100 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-5 h-5 bg-gradient-to-r from-[rgb(61,40,223)] to-[rgb(103,18,232)] rounded-md" />
          <h1 className="font-semibold text-lg text-gray-900">Careverse</h1>
        </Link>

        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <Link
              href="/"
              className="text-gray-500 hover:text-[rgb(61,40,223)] transition"
            >
              Home
            </Link>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-gray-500 cursor-pointer hover:text-[rgb(61,40,223)] transition flex items-center gap-1"
              >
                My Assessments
                <svg
                  className={`w-4 h-4 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                  {assessments.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-500">
                      No assessments yet.
                    </p>
                  ) : (
                    <ul className="max-h-80 overflow-y-auto">
                      {assessments.map((a) => (
                        <li key={a.id}>
                          <Link
                            href={`/assessment/${a.id}`}
                            onClick={() => setDropdownOpen(false)}
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-[rgb(246,244,255)] transition"
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
          </nav>
        </div>
      </div>
    </header>
  );
};

/* ────────────────────── Provider Avatar ────────────────────── */
const ProviderAvatar = ({ initials }) => (
  <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-gray-100 border border-gray-200 shadow-inner overflow-hidden flex-shrink-0">
    <img
      src={`https://placehold.co/100x100/A0BFFF/3D28E8/png?text=${initials}`}
      alt="avatar"
      className="w-full h-full object-cover p-1"
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

  // Redirect if no data
  useEffect(() => {
    if (!data) router.push("/chat");

    const fetchLocation = async () => {
      try {
        const res = await apiClient.get("/api/v1/users/location");
        const { location } = res.data;
        setLoc(location ?? []);
      } catch (err) {
        console.error("getLocation error:", err);
      }
    };

    fetchLocation();
  }, [data]);

  if (!data) return null;

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
    emergency: <AlertTriangle className="w-6 h-6 text-[rgb(61,40,223)]" />,
    doctor: <Stethoscope className="w-6 h-6 text-[rgb(61,40,223)]" />,
    info: <Info className="w-6 h-6 text-[rgb(61,40,223)]" />,
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
    <div className="flex flex-col min-h-screen pt-16 text-black">
      <Header />

      <main className="flex-1 bg-[rgb(246,244,255)] px-4 sm:px-6 lg:px-10 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto text-left mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2">
            Your Assessment Results
          </h1>
          <p className="text-gray-700 text-sm sm:text-base">
            Based on the symptoms you described.
          </p>
        </div>

        {/* Assessment Result Card */}
        <section className="bg-white rounded-2xl shadow-xl max-w-6xl mx-auto p-6 sm:p-8 mb-10 sm:mb-12">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            {/* Placeholder Image */}
            <div className="bg-[rgb(231,225,253)] w-full lg:max-w-[350px] h-48 lg:h-auto rounded-2xl flex-shrink-0 flex items-center justify-center">
              {severity === "emergency" && (
                <AlertTriangle
                  className="size-50 text-red-600 animate-pulse transition-transform duration-300 ease-in-out"
                  style={{ filter: "drop-shadow(0 0 10px #f87171)" }}
                />
              )}
              {severity === "high" && (
                <AlertCircle
                  className="size-50 text-orange-500 animate-bounce"
                  style={{ filter: "drop-shadow(0 0 10px #fb923c)" }}
                />
              )}
              {severity === "medium" && (
                <Info
                  className="size-50 text-yellow-400 animate-pulse"
                  style={{ filter: "drop-shadow(0 0 8px #fde68a)" }}
                />
              )}
              {severity === "low" && (
                <CheckCircle
                  className="size-50 text-green-500 animate-success-spin"
                  style={{ filter: "drop-shadow(0 0 8px #6ee7b7)" }}
                />
              )}
              {/* Custom animation for success */}
              <style jsx>{`
                @keyframes success-spin {
                  0% {
                    transform: scale(1) rotate(0deg);
                  }
                  20% {
                    transform: scale(1.1) rotate(-10deg);
                  }
                  40% {
                    transform: scale(1.15) rotate(10deg);
                  }
                  60% {
                    transform: scale(1.1) rotate(0deg);
                  }
                  100% {
                    transform: scale(1) rotate(0deg);
                  }
                }
                .animate-success-spin {
                  animation: success-spin 1.5s cubic-bezier(0.65, 0, 0.35, 1) 1;
                }
              `}</style>
            </div>
            {/* Content */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <div>
                  <p className="font-semibold text-sm mb-1 text-[rgb(61,40,223)]">
                    Possible Condition
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    {conditionName}
                  </h2>
                  {severity && (
                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${severityColor[severity]}`}
                    >
                      {severity.toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="p-3 rounded-full bg-[rgb(231,225,253)] self-start sm:self-auto">
                  <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-[rgb(61,40,223)]" />
                </div>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed text-sm sm:text-base">
                {conditionDesc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 sm:pt-6 border-t border-gray-100">
                <div>
                  <h3 className="font-semibold mb-1 text-gray-800 text-sm sm:text-base">
                    Common Triggers
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {triggers?.join(", ")}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-gray-800 text-sm sm:text-base">
                    Initial Self-Care
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {initialSelfCare?.join(", ")}
                  </p>
                </div>
              </div>

              {disclaimer && (
                <div className="mt-6 p-3 rounded-xl text-xs sm:text-sm bg-[rgb(231,225,253)]">
                  <p className="text-gray-600">
                    <span className="font-semibold mr-1 text-[rgb(61,40,223)]">
                      Disclaimer:
                    </span>
                    {disclaimer}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Suggested Next Steps */}
        <section className="max-w-6xl mx-auto mb-10 sm:mb-12">
          <h3 className="font-bold text-xl sm:text-2xl mb-6 text-gray-800">
            Suggested Next Steps
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {(nextSteps ?? []).map((item, i) => {
              const icon = iconMap[item.icon] || (
                <Info className="w-6 h-6 text-[rgb(61,40,223)]" />
              );

              return (
                <div
                  key={i}
                  onClick={() => item.url && window.open(item.url, "_blank")}
                  className="bg-white p-5 sm:p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-start hover:shadow-xl transition cursor-pointer"
                >
                  <div className="mb-4 p-3 rounded-full bg-[rgb(61,40,223)/.1]">
                    {icon}
                  </div>
                  <h4 className="font-semibold mb-1 text-base sm:text-lg">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Providers & Map */}
        <section className="max-w-6xl mx-auto mb-12 sm:mb-16">
          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-200">
            <div className="flex flex-wrap gap-8 text-sm sm:text-base font-medium">
              {["Overview", "Providers", "Products"].map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
              relative pb-3 transition-all duration-200 cursor-pointer
              ${
                isActive
                  ? "text-[rgb(61,40,223)] font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }
            `}
                  >
                    {tab}
                    {/* Active Indicator */}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[rgb(61,40,223)] rounded-full"
                        style={{
                          transform: "scaleX(1)",
                          transformOrigin: "left",
                        }}
                      />
                    )}
                    {/* Hover Indicator */}
                    {!isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-300 rounded-full scale-x-0 transition-transform duration-200 origin-left group-hover:scale-x-100" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Location */}
            {loc?.city && loc?.countryCode && (
              <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gray-500" />
                My Location:{" "}
                <span className="font-medium">
                  {loc.city}, {loc.countryCode}
                </span>
              </p>
            )}
          </div>

          {/* Tab Content */}

          {/* OVERVIEW TAB - Enhanced */}
          {activeTab === "Overview" && (
            <section className="mt-8 animate-fadeIn">
              {warnings.length > 0 ? (
                <div className="space-y-3">
                  {warnings.map((w, i) => (
                    <div
                      key={i}
                      className="bg-red-50 border border-red-200 text-red-800 p-5 rounded-2xl flex items-start gap-3 shadow-sm"
                    >
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-semibold text-red-900">
                          {w.message}
                        </p>
                        {w.action && (
                          <p className="text-sm mt-1.5 font-medium text-red-700">
                            Action: {w.action}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <p className="text-lg font-medium text-gray-800">
                    All systems operational
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    No warnings or alerts at this time.
                  </p>
                </div>
              )}
            </section>
          )}

          {/* PROVIDERS TAB - (Keep your existing polished version) */}
          {activeTab === "Providers" && (
            <section className="max-w-6xl mx-auto mb-12 sm:mb-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl overflow-hidden shadow-xl border lg:h-150 border-gray-200">
                  <img
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${loc.city},${loc.countryCode}&zoom=11&size=600x400&markers=color:red|${loc.city},${loc.countryCode}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`}
                    alt="Map"
                    className="w-full h-64 sm:h-80 lg:h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-4">
                  {providers.map((doc) => (
                    <div
                      key={doc.placeId || doc.name}
                      className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <ProviderAvatar
                          initials={doc.initials || getInitials(doc.name)}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold w-60 text-gray-800">
                            {doc.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {doc.specialty} · {doc.distance}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                            {doc.rating} ({doc.reviewCount} reviews)
                          </p>
                          <p>{doc.rating}</p>
                        </div>
                      </div>
                      {doc?.bookingUrl ? (
                        <Link
                          href={doc.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto bg-[rgb(61,40,223)] hover:bg-[rgb(103,18,232)] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
                        >
                          Book Appointment
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="w-full sm:w-auto bg-gray-300 text-white px-5 py-2.5 rounded-full text-sm font-semibold cursor-not-allowed"
                        >
                          No Booking Available
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* PRODUCTS TAB - Enhanced */}
          {activeTab === "Products" && (
            <section className="mt-8 animate-fadeIn">
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((p, i) => (
                    <div
                      key={i}
                      className="group bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl hover:border-[rgb(61,40,223)] transition-all duration-300 cursor-pointer"
                    >
                      {/* Icon */}
                      <div className="bg-gradient-to-br from-[rgb(61,40,223)] to-[rgb(103,18,232)] rounded-xl w-12 h-12 flex items-center justify-center mb-4 text-white">
                        <Package className="w-6 h-6" />
                      </div>

                      {/* Product Name & Type */}
                      <h4 className="font-bold text-xl text-gray-900">
                        {p.name}
                      </h4>
                      <p className="text-sm font-medium text-[rgb(61,40,223)] mt-1">
                        {p.type}
                      </p>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                        {p.description}
                      </p>

                      {/* Prescription / Consultation Tags */}
                      <div className="flex gap-2 mt-3">
                        {p.isPrescription ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Prescription Required
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Over the Counter
                          </span>
                        )}
                        {p.requiresConsultation && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            Consultation Suggested
                          </span>
                        )}
                      </div>

                      {/* Disclaimer (small text) */}
                      <p className="text-xs text-gray-500 mt-4 italic">
                        {p.disclaimer}
                      </p>

                      {/* CTA Link */}
                      <div className="mt-5 pt-4 border-t border-gray-100">
                        <Link
                          href={p.purchaseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-medium text-[rgb(61,40,223)] group-hover:underline"
                        >
                          Buy
                          <svg
                            className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1"
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
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-10 text-center">
                  <Package className="w-14 h-14 text-gray-400 mx-auto mb-3" />
                  <p className="text-lg font-medium text-gray-700">
                    No products available
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Check back later for updates.
                  </p>
                </div>
              )}
            </section>
          )}
        </section>

        {/* CTA Section */}
        <section className="max-w-6xl mx-auto p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4 rounded-2xl shadow-lg mb-10 bg-[rgb(231,225,253)]">
          <p className="text-gray-800 font-medium text-center sm:text-left text-base sm:text-lg">
            Want to explore other possibilities?
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              href="/chat"
              className="w-full sm:w-auto border px-5 py-2.5 rounded-full font-semibold transition text-sm bg-white border-[rgb(61,40,223)] text-[rgb(61,40,223)] hover:bg-[rgb(61,40,223)/.05]"
            >
              Refine Your Results
            </Link>

            <Link
              className="w-full sm:w-auto text-white px-5 py-2.5 rounded-full font-semibold transition flex items-center justify-center gap-2 text-sm bg-[rgb(61,40,223)] hover:bg-[rgb(103,18,232)]"
              href="/"
            >
              <RefreshCcw className="w-4 h-4" />
              Start A New Assessment
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
