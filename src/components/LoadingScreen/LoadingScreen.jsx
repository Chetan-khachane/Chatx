// src/components/LoadingScreen/LoadingScreen.jsx
import React from "react";

export default function LoadingScreen() {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#18181b]">
      <div className="flex flex-col items-center gap-4">
        {/* ChatX "logo" text */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#4fc4cf] to-[#7c3aed] flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">X</span>
          </div>
          <span className="text-2xl font-semibold tracking-[0.2em] text-white">
            CHAT<span className="text-[#4fc4cf]">X</span>
          </span>
        </div>

        {/* Spinner */}
        <div className="flex items-center gap-2 text-gray-300 text-sm">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="#4fc4cf"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span>Connecting to ChatX…</span>
        </div>
      </div>
    </div>
  );
}
