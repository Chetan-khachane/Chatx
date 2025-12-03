import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const formatTimestamp = (ts) => {
  if (!ts) return "";

  let date;
  if (ts.toDate) date = ts.toDate();
  else if (ts instanceof Date) date = ts;
  else {
    const parsed = new Date(ts);
    if (isNaN(parsed.getTime())) return ts.toString();
    date = parsed;
  }

  const d = date.getDate().toString().padStart(2, "0");
  const m = date.toLocaleString("default", { month: "short" });
  let hours = date.getHours();
  let minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${d} ${m}, ${hours}:${minutes} ${ampm}`;
};

export default function ChatTile({ message, sender, receiver, time }) {
  const { userInfo } = useAuth();
  const formattedTime = formatTimestamp(time);

  const contentRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    setIsOverflowing(el.scrollHeight > el.clientHeight);
  }, [message]);

  const isMine = sender === userInfo.uid;

  return (
    <div className="max-w-[600px] min-w-[200px] shadow-xl/10 font-[inter] bg-[#fcfcfb] rounded-xl p-3 flex flex-col">
      <span
        className={`font-bold ${isMine ? "text-emerald-500" : "text-red-600"}`}
      >
        {isMine ? "You" : receiver.name}
      </span>

      {/* text area with its own max-height */}
      <div
        ref={contentRef}
        className={`font-[poppins] whitespace-pre-wrap break-words ${
          expanded ? "" : "max-h-[200px] overflow-hidden"
        }`}
      >
        {message}
      </div>

      {/* read more / less */}
      {isOverflowing && !expanded && (
        <button
          className="text-xs text-blue-500 mt-1 self-start cursor-pointer underline"
          onClick={() => setExpanded(true)}
        >
          Read more
        </button>
      )}
      {expanded && (
        <button
          className="text-xs text-blue-500 mt-1 self-start underline cursor-pointer"
          onClick={() => setExpanded(false)}
        >
          Show less
        </button>
      )}

      {/* timestamp in normal flow, aligned right */}
      <div className="mt-1 self-end text-xs text-gray-400">{formattedTime}</div>
    </div>
  );
}
