import React from "react";

const HomeFooter = () => {
  return (
    <footer className="text-center py-8 sm:py-10 text-sm text-gray-700 bg-transparent">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mb-6">
        <a
          href="#"
          className="hover:text-[rgb(55,0,231)] transition-all duration-200 font-medium relative group"
        >
          Terms of Service
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[rgb(55,0,231)] group-hover:w-full transition-all duration-300"></span>
        </a>
        <a
          href="#"
          className="hover:text-[rgb(55,0,231)] transition-all duration-200 font-medium relative group"
        >
          Privacy Policy
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[rgb(55,0,231)] group-hover:w-full transition-all duration-300"></span>
        </a>
        <a
          href="#"
          className="hover:text-[rgb(55,0,231)] transition-all duration-200 font-medium relative group"
        >
          Contact Us
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[rgb(55,0,231)] group-hover:w-full transition-all duration-300"></span>
        </a>
      </div>
      <div className="max-w-2xl mx-auto px-4">
        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
        © {new Date().getFullYear()} Careverse. This is an AI-driven tool and
        not a substitute for professional medical advice.
      </p>
      </div>
    </footer>
  );
};

export default HomeFooter;
