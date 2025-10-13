import { motion, useInView } from "motion/react";
import { useRef } from "react";

interface BrandFeature {
  icon: React.ReactElement;
  title: string;
  description: string;
  color: string;
}

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.35 });

  const features: BrandFeature[] = [
    {
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: "Lightning Fast",
      description: "Express delivery to your doorstep in record time",
      color: "#BBEA70",
    },
    {
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      title: "Premium Quality",
      description: "Handpicked products that meet the highest standards",
      color: "#BBEA70",
    },
    {
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Happy Customers",
      description: "Join thousands of satisfied shoppers worldwide",
      color: "#BBEA70",
    },
    {
      icon: (
        <svg
          className="w-12 h-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: "Best Prices",
      description: "Competitive pricing with exclusive deals and offers",
      color: "#BBEA70",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section
      ref={ref}
      className="w-[95vw] max-w-7xl mt-4 mb-8 bg-gradient-to-br from-[#103531] via-[#0d2e2a] to-[#0a2723] rounded-2xl shadow-lg overflow-hidden relative"
    >
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl opacity-[0.2]" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary rounded-full blur-3xl opacity-[0.2]" />

      <div className="relative z-10 p-8 md:p-12 lg:p-16">
        {/* Section Title */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={titleVariants}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-grotesk text-[#FAF5E0] mb-4">
            Why Choose <span className="text-primary">LTP Store</span>?
          </h2>
          <div className="overflow-hidden">
            <motion.p
              className="text-[#FAF5E0]/80 text-base sm:text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Experience shopping like never before with our unmatched service
              and quality
            </motion.p>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -8,
                scale: 1.05,
                transition: { duration: 0.3 },
              }}
              className="group relative bg-white/5  rounded-xl p-6 border border-white/10 hover:border-primary/50 transition-colors duration-300"
            >
              {/* Icon Container with Animated Background */}
              <div
                className="relative mb-4 inline-block"
              >
                
                <div className="relative text-primary p-3 bg-brand/50 rounded-full group-hover:rotate-360 transition-transform duration-500 ease-in-out">
                  {feature.icon}
                </div>
              </div>

              {/* Text Content */}
              <h3 className="text-xl font-bold text-[#FAF5E0] mb-2 font-grotesk">
                {feature.title}
              </h3>
              <p className="text-[#FAF5E0]/70 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Animated Underline */}
              <motion.div
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.8,
              },
            },
          }}
        >
          {[
            { number: "150+", label: "Products" },
            { number: "99%", label: "Satisfaction" },
            { number: "24/7", label: "Support" },
            { number: "20+", label: "Brands" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: {
                    duration: 0.5,
                    ease: "easeOut",
                  },
                },
              }}
              className="text-center"
            >
              <motion.div
                className="text-3xl sm:text-4xl font-bold text-primary font-grotesk mb-2"
                initial={{ scale: 1 }}
                whileInView={{ scale: [1, 1.1, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {stat.number}
              </motion.div>
              <div className="text-[#FAF5E0]/70 text-sm sm:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
