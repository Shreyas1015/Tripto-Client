"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Car, MapPin, Navigation, Compass, LocateFixed } from "lucide-react";

const loaderVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const TriptoLoader = ({
  type = "car",
  text = "Loading...",
  size = "default",
  darkMode = false,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  const getSize = () => {
    switch (size) {
      case "small":
        return { container: "w-40 h-40", icon: "w-8 h-8" };
      case "large":
        return { container: "w-80 h-80", icon: "w-16 h-16" };
      default:
        return { container: "w-60 h-60", icon: "w-12 h-12" };
    }
  };

  const sizeClasses = getSize();

  const renderLoader = () => {
    switch (type) {
      case "road":
        return (
          <RoadLoader
            progress={progress}
            darkMode={darkMode}
            sizeClasses={sizeClasses}
          />
        );
      case "map":
        return (
          <MapLoader
            progress={progress}
            darkMode={darkMode}
            sizeClasses={sizeClasses}
          />
        );
      case "compass":
        return <CompassLoader darkMode={darkMode} sizeClasses={sizeClasses} />;
      case "3d":
        return (
          <ThreeDLoader
            progress={progress}
            darkMode={darkMode}
            sizeClasses={sizeClasses}
          />
        );
      case "car":
      default:
        return (
          <CarLoader
            progress={progress}
            darkMode={darkMode}
            sizeClasses={sizeClasses}
          />
        );
    }
  };

  return (
    <motion.div
      variants={loaderVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`flex flex-col items-center justify-center ${
        darkMode ? "text-white" : "text-gray-800"
      }`}
    >
      {renderLoader()}

      <div className="mt-6 text-center">
        <p
          className={`text-lg font-medium ${
            darkMode ? "text-gray-200" : "text-gray-700"
          }`}
        >
          {text}
        </p>
        <p
          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          {progress}%
        </p>
      </div>
    </motion.div>
  );
};

// Car driving on a circular track
const CarLoader = ({ progress, darkMode, sizeClasses }) => {
  const circleCircumference = 2 * Math.PI * 80;
  const progressOffset =
    circleCircumference - (progress / 100) * circleCircumference;

  return (
    <div className={`relative ${sizeClasses.container}`}>
      {/* Track */}
      <svg className="w-full h-full" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke={darkMode ? "#374151" : "#E5E7EB"}
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Progress Track */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke={darkMode ? "#3B82F6" : "#2563EB"}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circleCircumference}
          strokeDashoffset={progressOffset}
          transform="rotate(-90 100 100)"
        />

        {/* Road Markings */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
          <line
            key={index}
            x1={100 + 70 * Math.cos((angle * Math.PI) / 180)}
            y1={100 + 70 * Math.sin((angle * Math.PI) / 180)}
            x2={100 + 90 * Math.cos((angle * Math.PI) / 180)}
            y2={100 + 90 * Math.sin((angle * Math.PI) / 180)}
            stroke={darkMode ? "#6B7280" : "#9CA3AF"}
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        ))}
      </svg>

      {/* Car */}
      <motion.div
        className="absolute"
        style={{
          top: "50%",
          left: "50%",
          x: "-50%",
          y: "-50%",
        }}
        animate={{
          rotate: [0, 360],
          transition: {
            duration: 8,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          },
        }}
      >
        <motion.div
          style={{
            x: 80,
            rotate: 90,
          }}
        >
          <div
            className={`bg-blue-600 dark:bg-blue-500 rounded-full p-2 shadow-lg ${
              darkMode ? "text-white" : "text-white"
            }`}
          >
            <Car className={sizeClasses.icon} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Car driving on a straight road with progress
const RoadLoader = ({ progress, darkMode, sizeClasses }) => {
  return (
    <div className={`relative ${sizeClasses.container}`}>
      {/* Road */}
      <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-12 bg-gray-800 dark:bg-gray-700 rounded-full overflow-hidden">
        {/* Road Markings */}
        <div className="absolute inset-y-0 left-0 w-full flex items-center justify-center">
          <div className="w-full h-1 flex">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="h-full w-8 bg-yellow-400 mx-4"
                animate={{
                  x: [100, -100],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2,
                  ease: "linear",
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute inset-x-0 bottom-10 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
          style={{ width: `${progress}%` }}
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Car */}
      <motion.div
        className="absolute top-1/2 transform -translate-y-1/2"
        style={{ x: "-50%" }}
        animate={{
          x: [`${progress - 10}%`],
        }}
        transition={{
          duration: 0.5,
        }}
      >
        <motion.div
          animate={{
            y: [0, -3, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1,
            ease: "easeInOut",
          }}
          className={`bg-blue-600 dark:bg-blue-500 rounded-full p-2 shadow-lg ${
            darkMode ? "text-white" : "text-white"
          }`}
        >
          <Car className={sizeClasses.icon} />
        </motion.div>
      </motion.div>

      {/* Start and End Points */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4">
        <MapPin
          className={`${darkMode ? "text-gray-300" : "text-gray-700"} w-8 h-8`}
        />
      </div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4">
        <Navigation
          className={`${darkMode ? "text-gray-300" : "text-gray-700"} w-8 h-8`}
        />
      </div>
    </div>
  );
};

// Map with route animation
const MapLoader = ({ progress, darkMode, sizeClasses }) => {
  return (
    <div
      className={`relative ${
        sizeClasses.container
      } bg-blue-50 dark:bg-blue-900/20 rounded-xl overflow-hidden border-2 ${
        darkMode ? "border-gray-700" : "border-gray-200"
      }`}
    >
      {/* Map Grid */}
      <div className="absolute inset-0 grid grid-cols-6 grid-rows-6">
        {Array.from({ length: 36 }).map((_, i) => (
          <div
            key={i}
            className={`border ${
              darkMode ? "border-blue-800/30" : "border-blue-200"
            }`}
          />
        ))}
      </div>

      {/* Map Features */}
      <div className="absolute inset-0">
        {/* Water */}
        <div className="absolute top-1/4 right-1/4 w-1/3 h-1/3 rounded-full bg-blue-300 dark:bg-blue-700/50 opacity-50" />

        {/* Land */}
        <div className="absolute bottom-1/3 left-1/5 w-1/4 h-1/4 rounded-lg bg-green-200 dark:bg-green-800/30 opacity-40" />
        <div className="absolute top-1/6 left-1/6 w-1/5 h-1/5 rounded-lg bg-green-200 dark:bg-green-800/30 opacity-40" />
      </div>

      {/* Route Path */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <path
          d="M20,80 Q30,70 40,75 T60,60 T80,20"
          fill="none"
          stroke={darkMode ? "#3B82F6" : "#2563EB"}
          strokeWidth="2"
          strokeDasharray="1 1"
          opacity="0.7"
        />

        <motion.path
          d="M20,80 Q30,70 40,75 T60,60 T80,20"
          fill="none"
          stroke={darkMode ? "#60A5FA" : "#3B82F6"}
          strokeWidth="3"
          strokeDasharray="200"
          strokeDashoffset={200 - progress * 2}
          initial={{ strokeDashoffset: 200 }}
          animate={{ strokeDashoffset: 200 - progress * 2 }}
          transition={{ duration: 0.5 }}
        />
      </svg>

      {/* Start Point */}
      <div className="absolute bottom-1/5 left-1/5">
        <MapPin className="w-6 h-6 text-red-500" fill="currentColor" />
      </div>

      {/* End Point */}
      <div className="absolute top-1/5 right-1/5">
        <MapPin className="w-6 h-6 text-green-500" fill="currentColor" />
      </div>

      {/* Moving Car */}
      <motion.div
        className="absolute"
        initial={{ x: "20%", y: "80%" }}
        animate={{
          x:
            progress < 25
              ? `${20 + progress * 0.8}%`
              : progress < 50
              ? `${40 + (progress - 25) * 0.8}%`
              : progress < 75
              ? `${60 + (progress - 50) * 0.8}%`
              : `${80}%`,
          y:
            progress < 25
              ? `${80 - progress * 0.2}%`
              : progress < 50
              ? `${75 - (progress - 25) * 0.6}%`
              : progress < 75
              ? `${60 - (progress - 50) * 1.6}%`
              : `${20}%`,
        }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{
            rotate: [0, 45, 90, 135, 180, 225, 270, 315, 360],
          }}
          transition={{
            duration: 8,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          <div className="bg-blue-600 dark:bg-blue-500 rounded-full p-1 shadow-lg text-white">
            <Car className="w-4 h-4" />
          </div>
        </motion.div>
      </motion.div>

      {/* Compass */}
      <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md">
        <Compass
          className={`w-5 h-5 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
        />
      </div>
    </div>
  );
};

// Spinning Compass
const CompassLoader = ({ darkMode, sizeClasses }) => {
  return (
    <div className={`relative ${sizeClasses.container}`}>
      {/* Outer Ring */}
      <motion.div
        className={`w-full h-full rounded-full border-4 ${
          darkMode ? "border-gray-700" : "border-gray-300"
        } flex items-center justify-center`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        {/* Cardinal Directions */}
        {["N", "E", "S", "W"].map((dir, i) => (
          <div
            key={dir}
            className="absolute font-bold"
            style={{
              top: i === 0 ? "5%" : i === 2 ? "95%" : "50%",
              left: i === 3 ? "5%" : i === 1 ? "95%" : "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <span
              className={`text-lg ${
                darkMode ? "text-blue-400" : "text-blue-600"
              }`}
            >
              {dir}
            </span>
          </div>
        ))}

        {/* Tick Marks */}
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className={`absolute h-2 w-0.5 ${i % 2 === 0 ? "h-3" : "h-1.5"} ${
              darkMode ? "bg-gray-600" : "bg-gray-400"
            }`}
            style={{
              transform: `rotate(${i * 15}deg) translateY(-45%)`,
              transformOrigin: "bottom center",
              bottom: "50%",
              left: "calc(50% - 0.5px)",
            }}
          />
        ))}

        {/* Inner Circle */}
        <div
          className={`w-3/4 h-3/4 rounded-full ${
            darkMode ? "bg-gray-800" : "bg-white"
          } border ${
            darkMode ? "border-gray-700" : "border-gray-200"
          } flex items-center justify-center shadow-inner`}
        >
          {/* Compass Needle */}
          <motion.div
            className="relative w-full h-full"
            animate={{ rotate: [0, 15, -15, 0, 180, 165, 195, 180, 360] }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              times: [0, 0.1, 0.2, 0.25, 0.5, 0.6, 0.7, 0.75, 1],
            }}
          >
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-1/2 bg-red-500 rounded-t-full" />
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1/2 bg-blue-500 rounded-b-full" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-600 border-2 border-gray-300 dark:border-gray-700" />
          </motion.div>
        </div>
      </motion.div>

      {/* Car Icon */}
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <div
          className={`bg-blue-600 dark:bg-blue-500 rounded-full p-2 shadow-lg ${
            darkMode ? "text-white" : "text-white"
          }`}
        >
          <Car className="w-6 h-6" />
        </div>
      </motion.div>
    </div>
  );
};

// 3D-like Car Animation
const ThreeDLoader = ({ progress, darkMode, sizeClasses }) => {
  return (
    <div className={`relative ${sizeClasses.container}`}>
      {/* 3D Platform */}
      <div className="absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/10 rounded-lg perspective-effect" />

      {/* Shadow */}
      <motion.div
        className="absolute bottom-[20%] left-1/2 transform -translate-x-1/2 w-20 h-4 bg-black/20 dark:bg-black/40 rounded-full blur-md"
        animate={{
          width: ["80px", "70px", "80px"],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Car */}
      <motion.div
        className="absolute bottom-[25%] left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, -10, 0],
          rotateY: [0, 360],
          z: [0, 50, 0],
        }}
        transition={{
          y: {
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
          rotateY: {
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          },
          z: {
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Car Body */}
        <div className="relative">
          {/* Car Top */}
          <div className="w-24 h-10 bg-blue-600 dark:bg-blue-500 rounded-t-lg" />

          {/* Car Bottom */}
          <div className="w-32 h-8 bg-blue-700 dark:bg-blue-600 rounded-b-lg -mt-1" />

          {/* Windows */}
          <div className="absolute top-2 left-4 w-16 h-6 bg-blue-300 dark:bg-blue-300/50 rounded-sm" />

          {/* Wheels */}
          <motion.div
            className="absolute -bottom-3 left-4 w-6 h-6 bg-gray-800 dark:bg-gray-900 rounded-full border-2 border-gray-300 dark:border-gray-600"
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>
          </motion.div>

          <motion.div
            className="absolute -bottom-3 right-4 w-6 h-6 bg-gray-800 dark:bg-gray-900 rounded-full border-2 border-gray-300 dark:border-gray-600"
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>
          </motion.div>

          {/* Lights */}
          <div className="absolute top-4 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          <div className="absolute top-4 -left-1 w-2 h-2 bg-yellow-400 rounded-full" />

          {/* Exhaust Animation */}
          <div className="absolute -bottom-1 -left-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-gray-300 dark:bg-gray-400 rounded-full absolute"
                initial={{ opacity: 0.8, x: 0 }}
                animate={{
                  opacity: [0.8, 0],
                  x: [0, -10],
                  y: [0, i === 1 ? -2 : i === 2 ? 0 : 2],
                }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <div className="absolute inset-x-10 bottom-10 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
          style={{ width: `${progress}%` }}
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Location Pins */}
      <div className="absolute bottom-[22%] left-[15%]">
        <LocateFixed
          className={`w-5 h-5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        />
      </div>
      <div className="absolute bottom-[22%] right-[15%]">
        <MapPin
          className={`w-5 h-5 ${darkMode ? "text-red-400" : "text-red-600"}`}
        />
      </div>
    </div>
  );
};

export default TriptoLoader;
