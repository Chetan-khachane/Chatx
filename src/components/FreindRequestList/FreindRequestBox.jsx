import React, { useEffect, useState } from "react";
import UseAvatar from "../Avatar/Avatar";
import { db } from "../../config/firebase";
import { deleteDoc, doc, getDoc, updateDoc,arrayUnion } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
export default function FreindRequestBox({
  profileUrl,
  name,
  phone,
  status,
  from_id,
  to_id,
  FreindList
}) {
  const [statusState, setStatusState] = useState("");
  const { userInfo } = useAuth();

  const setWhetherConfirmed = async () => {
    const docRef = doc(db, "FreindRequests", `${from_id}_${to_id}`);
    await updateDoc(docRef, { status : statusState });
    if (statusState === "accepted") {
      const docRefReceiver = doc(db, "Users", userInfo.uid);
      await updateDoc(docRefReceiver, {
        FreindList: arrayUnion({freindUid : from_id,profileUrl,name})
      });
    }

  };

  useEffect(() => {
    if (statusState) {
      setWhetherConfirmed();
    }
  }, [statusState]);

  return (
    status == "pending" || from_id == userInfo.uid ?
    <div className="w-full bg-[#d8d8d3] p-3 md:p-4 flex flex-wrap flex-col md:flex-row items-start md:items-center gap-3 md:gap-5 my-2  shadow-md">
      <div className="flex-shrink-0">
        <UseAvatar
          profileUrl={profileUrl}
          
          styling="w-4 h-4 md:w-16 md:h-16 rounded-full shadow-md bg-gray-300"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-md font-bold text-gray-900 ">
          {name}
        </div>
        <div className="text-sm  text-gray-600 ">{phone}</div>
      </div>
      {
      to_id === userInfo.uid && status == "pending"? (
        <div>
          <button onClick={() => setStatusState("accepted")}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="glass" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" operator="over" />
                </filter>
              </defs>
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="rgba(255,255,255,0.25)"
                stroke="#2ECC71"
                strokeWidth="2"
                filter="url(#glass)"
              />
              <path
                d="M18 24 L22 28 L30 20"
                fill="none"
                stroke="#2ECC71"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button onClick={() => setStatusState("rejected")}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="rgba(255,255,255,0.25)"
                stroke="#E74C3C"
                strokeidth="2"
              />
              <path
                d="M18 18 L30 30 M30 18 L18 30"
                stroke="#E74C3C"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      ) : 
        <div className="flex flex-wrap gap-2 justify-center items-center">
          <span className={`font-bold text-sm ${status == "pending" ? "text-yellow-400" : status == "accepted" ? "text-emerald-600" : "text-red-600"}`}>{status.toUpperCase()}</span>
          <button onClick={async()=>{
            const docRef = doc(db,"FreindRequests",`${from_id}_${to_id}`)
            await deleteDoc(docRef)
          }}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="rgba(255,255,255,0.25)"
                stroke="#E74C3C"
                strokeWidth="2"
              />
              <path
                d="M18 18 L30 30 M30 18 L18 30"
                stroke="#E74C3C"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
       
    }
    </div> : ""
  );
}
