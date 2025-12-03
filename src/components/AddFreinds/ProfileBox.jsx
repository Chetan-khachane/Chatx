import React, { useState } from "react";
import UseAvatar from "../Avatar/Avatar";
import { setDoc, doc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../config/firebase";

export default function ProfileBox({
  receiverProfileUrl,
  receiverName,
  receiverPhone,
  receiverUid,
}) {
  const { userInfo, freindRequests } = useAuth();
  const isSentRequest = freindRequests.sent?.some((r) => r.from_id === userInfo.uid);
  const [isSent, setIsSent] = useState(isSentRequest);
  const isUserFreind = userInfo.FreindList?.some((r)=>r.freindUid === receiverUid)
  const sendFriendRequest = async (e) => {
    try {
      await setDoc(doc(db, "FreindRequests", `${userInfo.uid}_${receiverUid}`), {
        //profileUrl of both,name of both,phone of both,email of both
        status: "pending",
        senderProfileUrl: userInfo.profileUrl,
        senderName: userInfo.name,
        senderPhone: userInfo.phone,
        receiverProfileUrl,
        receiverName,
        receiverPhone,
        from_id: userInfo.uid,
        to_id: receiverUid,
      });
      setIsSent(!isSent);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="w-full bg-[#d8d8d3] p-3 md:p-4 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-5 my-2  shadow-md">
      <div className="flex-shrink-0">
        <UseAvatar
          profileUrl={receiverUid === userInfo.uid ? userInfo.profileUrl : receiverProfileUrl }
          styling="w-12 h-12 md:w-16 md:h-16 rounded-full shadow-md bg-gray-300"
          
        />
      </div>



      <div className="flex-1 min-w-0">
        <div className="text-base md:text-lg font-semibold text-gray-900 truncate">
          {receiverUid === userInfo.uid ? userInfo.name : receiverName  }
        </div>
        <div className="text-sm md:text-md text-gray-600 truncate">{receiverUid === userInfo.phone ? userInfo.phone : receiverPhone  }</div>
      </div>

      <div className="w-full md:w-auto md:ml-auto">
        <button
          onClick={(e) => sendFriendRequest(e)}
          disabled={isSent || isUserFreind}
          className={`w-full md:w-auto px-4 py-2 h-10 font-medium transition
        ${
          isSent
            ? "cursor-default bg-green-600 text-white flex items-center gap-2"
            : "cursor-pointer bg-emerald-500 text-white hover:bg-green-400"
        }`}
        >
          {isSent ? (
            <span className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {
                isUserFreind ? "Freinds" : 
              "Request Sent"
}
            </span>
          ) : (
            isUserFreind ? 
             "Freinds" : "Add Friend"
          )}
        </button>
      </div>
    </div>
  );
}
