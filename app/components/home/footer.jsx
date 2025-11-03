import React from "react";

const HomeFooter = () => {
  return (
    <footer className="text-center py-4 text-sm text-gray-800 bg-transparent">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-3">
        <a href="#" className="hover:text-[rgb(55,0,231)] transition">
          Terms of Service
        </a>
        <a href="#" className="hover:text-[rgb(55,0,231)] transition">
          Privacy Policy
        </a>
        <a href="#" className="hover:text-[rgb(55,0,231)] transition">
          Contact Us
        </a>
      </div>
      <p className="text-gray-700 text-xs">
        © {new Date().getFullYear()} Careverse. This is an AI-driven tool and
        not a substitute for professional medical advice.
      </p>
    </footer>
  );
};

export default HomeFooter;
