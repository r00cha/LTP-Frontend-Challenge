import { motion } from "motion/react";
import { useState } from "react";
import LottieComponent from "./LottieComponent";
import blobData from "../../lotties/blob.json";
import { DrawCircleText } from "./DrawCircleText";

export function HeroSection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="bg-brand mt-4 rounded-2xl w-[95vw] max-w-7xl shadow-lg overflow-hidden">
      <div className="p-4 flex flex-col sm:flex-row gap-8 sm:gap-12 md:gap-16 lg:gap-24 items-center justify-start mx-auto w-[90%]">
        
        <div className="flex flex-col items-start gap-4 sm:gap-8 md:gap-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-grotesk text-[#FAF5E0] ">
            <motion.span
              initial={{ opacity: 0, y: 20, rotate: 2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0 }}
              className="block"
            >
              You need it,
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="block"
            >
              We <DrawCircleText text={"have"} /> it!
            </motion.span>
          </h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="max-w-sm sm:max-w-md lg:max-w-lg text-[#FAF5E0] text-sm sm:text-base "
          >
            Here you'll find a variety of products to suit your needs. Browse through our categories and discover amazing deals!
          </motion.p>
          <motion.a 
            href="#shop" 
            className="flex items-center gap-1 bg-primary text-[#043027] font-semibold py-3 px-4 sm:py-4 sm:px-5 rounded overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.2 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative text-xl overflow-hidden h-5">
              <motion.span
                animate={{ y: isHovered ? "-100%" : -5 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="block"
              >
                Shop now
              </motion.span>
              <motion.span
                animate={{ y: isHovered ? -5 : "100%" }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="block absolute inset-0"
              >
                Shop now
              </motion.span>
            </div>
            
            <svg 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.a>
        </div>

        {/* Illustration */}
        <div className="relative">
          <LottieComponent animationData={blobData} className="absolute w-[110%] inset-y-4 sm:inset-y-8 sm:w-[120%] sm:-inset-x-4" />
          <motion.img 
            src="/bag-2.png" 
            alt="Shopping Illustration" 
            className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 translate-y-22 drop-shadow-2xl drop-shadow-neutral-800 relative z-10 hover:scale-105 hover:rotate-3 transition-transform duration-300"
            initial={{ opacity: 0, y: 120, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "linear" }}
          />
        </div>
        
      </div>
    </section>
  );
}
