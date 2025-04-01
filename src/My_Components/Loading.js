"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Loading = ({ show }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timer;
    if (show) {
      timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000); // Delay of 500ms before showing the loader
    } else {
      setIsVisible(false);
    }

    return () => clearTimeout(timer); // Cleanup function
  }, [show]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="loading-backdrop fixed inset-0 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(8px)",
      }}
    >
      <motion.div
        className="loading-content relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Background elements */}
        <motion.div
          className="absolute -z-10 top-1/4 right-[10%] w-64 h-64 rounded-full blur-3xl opacity-40"
          style={{ background: "rgba(59, 130, 246, 0.3)" }}
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -z-10 bottom-1/4 left-[10%] w-72 h-72 rounded-full blur-3xl opacity-30"
          style={{ background: "rgba(96, 165, 250, 0.3)" }}
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        {/* Card container */}
        <div
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto"
          style={{
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.1)",
          }}
        >
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <motion.div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #0bbfe0 100%)",
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <motion.div
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center"
                animate={{ scale: [1, 0.8, 1] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <motion.div
                  className="w-8 h-8 rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, #3b82f6 0%, #0bbfe0 100%)",
                  }}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Loading text */}
          <motion.h1
            className="text-2xl font-bold text-center text-gray-800 mb-4"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            Loading
          </motion.h1>

          {/* Loading dots */}
          <div className="flex justify-center space-x-3 mt-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, #3b82f6 0%, #0bbfe0 100%)",
                }}
                animate={{
                  y: ["0%", "-50%", "0%"],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>

          {/* Loading progress bar */}
          <div className="mt-8 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #3b82f6 0%, #0bbfe0 100%)",
              }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Loading;
