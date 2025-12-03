import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ProfileBox from "./ProfileBox";
export default function AddFreinds({ styling }) {
  const [showSearchTool, setShowSearchTool] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { profiles, userInfo } = useAuth();
  const [selectedProfiles, setSelectedProfiles] = useState(profiles);
  function detectInputType(value) {
    const trimmed = value.trim();

    // Phone (supports +91, +1, +XX, or digits only)
    if (/^[+\d\-\s()]+$/.test(trimmed)) return "phone";
    return "name";
  }
  useEffect(() => {
    if (searchTerm !== "") {
      const type = detectInputType(searchTerm);

      switch (type.trim()) {
        case "phone":
          const normalizedQuery = searchTerm.replace(/\D/g, "");
          const filtered = profiles.filter((profile) => {
            if (!profile.phone) return false;
            const normalizedPhone = profile.phone.replace(/\D/g, "");
            return normalizedPhone.startsWith(normalizedQuery);
          });
          setSelectedProfiles(filtered);
          break;
        case "name":
          setSelectedProfiles(
            profiles.filter(
              (profile) =>
                profile.name
                  .toLowerCase()
                  .startsWith(searchTerm.toLowerCase()) ||
                profile.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
          );
          break;
        default:
          setSelectedProfiles(profiles);
          return;
      }
    }else{
      setSelectedProfiles(profiles)
    }
  }, [searchTerm]);

  return (
    <div
      className={`transition-all px-5 ease-in-out duration-800 ${
        showSearchTool
          ? "h-full bg-[#fffffe]  w-full absolute bottom-0 right-0 shadow-xl"
          : `${styling} bg-none`
      }`}
    >
      <button
        onClick={() => setShowSearchTool(!showSearchTool)}
        className={`cursor-pointer ${
          showSearchTool ? "absolute right-5 top-5" : ""
        }`}
      >
        {!showSearchTool ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="60"
            height="60"
            viewBox="0 0 60 60"
            role="img"
            aria-label="Add"
          >
            <defs>
              <linearGradient id="greenVibe" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4df48b" />
                <stop offset="50%" stopColor="#32d96c" />
                <stop offset="100%" stopColor="#00b65a" />
              </linearGradient>

              <filter id="softGlow">
                <feDropShadow
                  dx="0"
                  dy="4"
                  stdDeviation="6"
                  floodColor="#4df48b"
                  floodOpacity="0.35"
                />
              </filter>
            </defs>

            <circle
              cx="30"
              cy="30"
              r="24"
              fill="url(#greenVibe)"
              filter="url(#softGlow)"
            />

            <g
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 30h24" />
              <path d="M30 18v24" />
            </g>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 24 24"
            stroke="#111"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            <path d="M6 6l12 12" />
            <path d="M18 6l-12 12" />
          </svg>
        )}
      </button>
      {showSearchTool ? (
        <div className="mt-18">
          <input
            type="text"
            className="outline-none rounded-md p-2 bg-[#f2f7f5] text-gray-600 font-medium w-full"
            placeholder="Enter a phone Number  or Name"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul>
            {selectedProfiles ? (
              selectedProfiles.map((profile, idx) =>
                !(profile.uid === userInfo.uid) ? (
                  <li key={idx}>
                    <ProfileBox
                      receiverName={profile.name}
                      receiverProfileUrl={profile.profileUrl}
                      receiverPhone={profile.phone}
                      receiverUid={profile.uid}
                    />
                  </li>
                ) : (
                 ""
                )
              )
            ) : (
              <li>No Profiles found</li>
            )}
          </ul>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
