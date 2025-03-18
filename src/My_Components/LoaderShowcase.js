"use client";

import { useState } from "react";
import TriptoLoader from "./TriptoLoader";

const LoaderShowcase = () => {
  const [selectedLoader, setSelectedLoader] = useState("car");
  const [darkMode, setDarkMode] = useState(false);
  const [size, setSize] = useState("default");
  const [customText, setCustomText] = useState("Loading your trip...");

  const loaderTypes = [
    { id: "car", name: "Car Circular" },
    { id: "road", name: "Road Journey" },
    { id: "map", name: "Map Route" },
    { id: "compass", name: "Compass" },
    { id: "3d", name: "3D Car" },
  ];

  const sizes = [
    { id: "small", name: "Small" },
    { id: "default", name: "Medium" },
    { id: "large", name: "Large" },
  ];

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Tripto Loader Showcase
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <TriptoLoader
              type={selectedLoader}
              text={customText}
              darkMode={darkMode}
              size={size}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Loader Options</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Loader Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {loaderTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedLoader(type.id)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        selectedLoader === type.id
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-transparent"
                      }`}
                    >
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Size</label>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((sizeOption) => (
                    <button
                      key={sizeOption.id}
                      onClick={() => setSize(sizeOption.id)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        size === sizeOption.id
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-transparent"
                      }`}
                    >
                      {sizeOption.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="customText"
                  className="block text-sm font-medium mb-2"
                >
                  Custom Text
                </label>
                <input
                  type="text"
                  id="customText"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm">Dark Mode</span>
                </label>
              </div>

              <div className="pt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Import the TriptoLoader component and use it in your
                  application:
                </p>
                <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs overflow-x-auto">
                  {`import TriptoLoader from './components/TriptoLoader'

// In your component:
<TriptoLoader 
  type="${selectedLoader}" 
  text="${customText}"
  darkMode={${darkMode}} 
  size="${size}"
/>`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoaderShowcase;
