import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import FreindRequestBox from "./FreindRequestBox";
export default function FreindRequestList({ listEnabled = false, onClose }) {
  const { freindRequests } = useAuth();
  return (
    <div className={`w-[70%] ${listEnabled ? "block" : "hidden"} absolute top-18 right-0 z-50 bg-[#f8f5f2] px-1 py-2`}>
      <div className="h-70 bg-[#fffffe] relative shadow-lg w-full p-2">
        <span className="font-medium text-2xl bg-[] text-[#094067]">Sent</span>
        <button className="absolute top-2 right-0 cursor-pointer duration-500" onClick={onClose}>
            <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
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
        </button>
        <ul className=" overflow-y-scroll mt-2 custom-scrollbar-rect h-[85%] bg-[#f2f4f6]">
          {freindRequests.sent.map((req,idx) => 
            <FreindRequestBox key={idx}
              profileUrl={req.receiverProfileUrl} 
              name={req.receiverName} 
              phone={req.receiverPhone}
              status={req.status}
              from_id={req.from_id}
              to_id={req.to_id}
            />
          )}
          
        </ul>
      </div>
      <div className="h-70 mt-3 bg-[#fffffe] shadow-lg w-full p-2">
        <span className="font-medium text-2xl bg-[] text-[#094067]">Received</span>
        <ul className="mt-2 overflow-y-scroll custom-scrollbar-rect h-[85%] bg-[#f2f4f6]">
          {freindRequests.received.map((req,idx) => 
            <FreindRequestBox key={idx}
              profileUrl={req.senderProfileUrl}
              name={req.senderName}
              phone={req.senderPhone}
              status={req.status}
              from_id={req.from_id}
              to_id={req.to_id}
            />
          )}
        </ul>
      </div>
    </div>
  );
}
