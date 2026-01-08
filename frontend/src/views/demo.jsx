import React from "react";

const Demo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        
        {/* Icon / Badge */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center">
          <span className="text-3xl">🚀</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Demo Page
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          This is a beautifully designed demo screen.  
          You can use it to showcase features, content, or testing layouts.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition">
            Get Started
          </button>

          <button className="px-5 py-2.5 rounded-xl border border-indigo-600 text-indigo-600 font-medium hover:bg-indigo-50 transition">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default Demo;
