import React from "react";
import { motion } from "motion/react";

export const DrawCircleText = ({text}: {text: string}) => {
  return (

    <span className="relative text-4xl sm:text-5xl lg:text-6xl text-[#FAF5E0] font-grotesk">
          {text}
          <svg
            viewBox="0 0 160 75"
            fill="none"
            className="absolute top-0 sm:-top-1 -left-2 -right-2 sm:-left-4 sm:-right-4"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{
                duration: 1.25,
                ease: "easeInOut",
              }}
              d="M92.5 6.5C41 8.5 12.7348 6.51272 6.00007 20.5C-0.500004 34 2.5 56 8.50006 63.5C14.5001 71 126.5 77 141.5 69C155.904 61.3177 159.5 47 158 36.5C156.8 28.1 146.333 17.8333 132 17C117.667 16.1667 110 18 84.5 12.5C77.9455 11.0863 49.1667 5.83333 40.5 1.5"
              stroke="#B8E779"
              strokeWidth="3"
            />
          </svg>
        </span>
  );
};
