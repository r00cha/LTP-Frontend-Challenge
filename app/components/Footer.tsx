import { useEffect, useState } from "react";

export function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const currentYear = new Date().getFullYear();
  const footerText = "© {year} Miguel Rocha, LTP Labs. All rights reserved.".replace("{year}", currentYear.toString());
  const words = footerText.split(" ");

  return (
    <footer className="mt-auto border-t border-slate-200 bg-gradient-to-br from-[#103531] via-[#0d2e2a] to-[#0a2723] py-6">
      <div className="mx-auto w-full container px-4">
        {/* Logo Section */}
        <div className="flex justify-center items-center gap-2">
          <div className="transform transition-transform duration-300 hover:scale-105">
            <img 
              src="/logo-ltp-white.png" 
              alt="LTP Labs Logo" 
              className="h-16 w-auto"
              loading="lazy"
            />
          </div>
          <span className="text-white text-xl">Store</span>
        </div>

        {/* Animated Text Section */}
        <div className="text-center mb-8">
          <div className="flex flex-wrap justify-center gap-2 text-lg font-medium text-[#fef5e0]">
            {words.map((word, index) => (
              <span
                key={index}
                className={`inline-block transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* Links Section */}
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          <a 
            href="https://linkedin.com/in/migueldrocha28" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#fef5e0] hover-underline transition-all duration-300 transform hover:-translate-y-0.5 font-medium"
          >
            LinkedIn
          </a>
          <a 
            href="https://github.com/r00cha" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#fef5e0] hover-underline transition-all duration-300 transform hover:-translate-y-0.5 font-medium"
          >
            GitHub
          </a>
          <a 
            href="/" 
            className="text-[#fef5e0] hover-underline transition-all duration-300 transform hover:-translate-y-0.5 font-medium"
          >
            About
          </a>
          <a 
            href="/" 
            className="text-[#fef5e0] hover-underline transition-all duration-300 transform  hover:-translate-y-0.5 font-medium"
          >
            Contact
          </a>
        </div>

        {/* Decorative Element */}
        <div className="flex justify-center">
          <div className="w-100 h-1 bg-gradient-to-r from-transparent via-[#b5ed71] to-transparent rounded-full"></div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-[#005838]/70">
          <p className="text-[#ffffff7c] transition-colors duration-300">
            Crafted with passion and dedication
          </p>
        </div>
      </div>
    </footer>
  );
}
