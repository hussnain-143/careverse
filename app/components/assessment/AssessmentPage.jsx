"use client";
import React, { useState } from "react";
import {
  MapPin,
  Star,
  Stethoscope,
  Brain,
  Pill,
  RefreshCcw,
  User,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

/* ────────────────────── Responsive Header ────────────────────── */
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 bg-white border-b border-gray-100 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-5 h-5 bg-gradient-to-r from-[rgb(61,40,223)] to-[rgb(103,18,232)] rounded-md" />
          <h1 className="font-semibold text-lg text-gray-900">Careverse</h1>
        </div>

        <div className="flex items-center gap-8">
                    {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link href="/" className="text-gray-500 hover:text-[rgb(61,40,223)] transition">
            Home
          </Link>
          <Link
            href="/"
            className="font-medium text-gray-900 border-b-2 border-[rgb(61,40,223)] pb-0.5"
          >
            My Assessments
          </Link>
        </nav>

        {/* Desktop Profile */}
        <div className="hidden md:flex items-center gap-6">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-gray-300 to-gray-200">
            <User className="w-5 h-5 text-white/90" />
          </div>
        </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-3">
            <a
              href="/"
              className="block text-gray-500 hover:text-[rgb(61,40,223)] transition text-sm"
            >
              Home
            </a>
            <a
              href="/"
              className="block font-medium text-gray-900 text-sm"
            >
              My Assessments
            </a>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-gray-300 to-gray-200">
                <User className="w-5 h-5 text-white/90" />
              </div>
            </div>
          </div>
        </div>
      )}
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

export default function AssessmentResults() {
  const doctors = [
    { name: "Dr. Evelyn Reed", role: "Neurologist", distance: "2.1 miles away", rating: 4.9, reviews: 128, initials: "ER" },
    { name: "Dr. Ben Carter", role: "Neurologist", distance: "3.5 miles away", rating: 4.8, reviews: 92, initials: "BC" },
    { name: "Dr. Olivia Chen", role: "Headache Specialist", distance: "4.2 miles away", rating: 4.8, reviews: 210, initials: "OC" },
  ];

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
            <div className="bg-[rgb(231,225,253)] w-full lg:max-w-[350px] h-48 lg:h-auto rounded-2xl flex-shrink-0" />

            {/* Content */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <div>
                  <p className="font-semibold text-sm mb-1 text-[rgb(61,40,223)]">
                    Possible Condition
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold">Migraine</h2>
                </div>
                <div className="p-3 rounded-full bg-[rgb(231,225,253)] self-start sm:self-auto">
                  <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-[rgb(61,40,223)]" />
                </div>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed text-sm sm:text-base">
                A neurological condition that can cause multiple symptoms, often characterized by
                intense, debilitating headaches. They may be accompanied by nausea, vomiting,
                and sensitivity to light and sound.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 sm:pt-6 border-t border-gray-100">
                <div>
                  <h3 className="font-semibold mb-1 text-gray-800 text-sm sm:text-base">Common Triggers</h3>
                  <p className="text-gray-600 text-sm">
                    Stress, hormonal changes, certain foods & drinks, lack of sleep
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-gray-800 text-sm sm:text-base">Initial Self-Care</h3>
                  <p className="text-gray-600 text-sm">
                    Rest in a quiet dark room, apply a cold compress, and stay hydrated
                  </p>
                </div>
              </div>

              <div className="mt-6 p-3 rounded-xl text-xs sm:text-sm bg-[rgb(231,225,253)]">
                <p className="text-gray-600">
                  <span className="font-semibold mr-1 text-[rgb(61,40,223)]">
                    Disclaimer:
                  </span>
                  This is not a medical diagnosis. Please consult a healthcare professional for
                  an accurate diagnosis and appropriate treatment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Suggested Next Steps */}
        <section className="max-w-6xl mx-auto mb-10 sm:mb-12">
          <h3 className="font-bold text-xl sm:text-2xl mb-6 text-gray-800">Suggested Next Steps</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: <Stethoscope className="w-6 h-6 text-[rgb(61,40,223)]" />,
                title: "Book a Neurologist",
                desc: "Find a local specialist",
              },
              {
                icon: <Brain className="w-6 h-6 text-[rgb(61,40,223)]" />,
                title: "Explore Stress Relief Programs",
                desc: "Discover coping mechanisms",
              },
              {
                icon: <Pill className="w-6 h-6 text-[rgb(61,40,223)]" />,
                title: "View Relevant Medications",
                desc: "Learn about treatment options",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-5 sm:p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-start hover:shadow-xl transition"
              >
                <div className="mb-4 p-3 rounded-full bg-[rgb(61,40,223)/.1]">
                  {item.icon}
                </div>
                <h4 className="font-semibold mb-1 text-base sm:text-lg">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Providers & Map */}
        <section className="max-w-6xl mx-auto mb-12 sm:mb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex flex-wrap gap-3 sm:gap-6 text-sm sm:text-base text-gray-700">
              {["Overview", "Providers Nearby", "Products & Remedies"].map((tab, i) => {
                const isActive = i === 1;
                return (
                  <button
                    key={tab}
                    className={`font-semibold pb-1 border-b-2 transition ${
                      isActive
                        ? "text-[rgb(61,40,223)] border-[rgb(61,40,223)]"
                        : "text-gray-500 border-transparent hover:border-gray-400"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gray-500" />
              Set My Location: San Francisco, CA
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Map */}
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              <img
                src="https://placehold.co/600x400/DDEEFF/3040A0/png?text=San+Francisco+Map"
                alt="Map"
                className="w-full h-64 sm:h-80 lg:h-full object-cover"
              />
            </div>

            {/* Doctors List */}
            <div className="flex flex-col gap-4">
              {doctors.map((doc) => (
                <div
                  key={doc.name}
                  className="bg-white p-4 sm:p-5 rounded-2xl shadow-lg border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-xl transition"
                >
                  <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <ProviderAvatar initials={doc.initials} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{doc.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {doc.role} · {doc.distance}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        {doc.rating} ({doc.reviews} reviews)
                      </p>
                    </div>
                  </div>

                  <button className="w-full sm:w-auto text-white px-4 py-2 rounded-full text-sm font-semibold transition bg-[rgb(61,40,223)] hover:bg-[rgb(103,18,232)]">
                    Book Appointment
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-6xl mx-auto p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4 rounded-2xl shadow-lg mb-10 bg-[rgb(231,225,253)]">
          <p className="text-gray-800 font-medium text-center sm:text-left text-base sm:text-lg">
            Want to explore other possibilities?
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button className="w-full sm:w-auto border px-5 py-2.5 rounded-full font-semibold transition text-sm bg-white border-[rgb(61,40,223)] text-[rgb(61,40,223)] hover:bg-[rgb(61,40,223)/.05]">
              Refine Your Results
            </button>

            <button
              className="w-full sm:w-auto text-white px-5 py-2.5 rounded-full font-semibold transition flex items-center justify-center gap-2 text-sm bg-[rgb(61,40,223)] hover:bg-[rgb(103,18,232)]"
              onClick={() => (window.location.href = "/")}
            >
              <RefreshCcw className="w-4 h-4" />
              Start A New Assessment
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}