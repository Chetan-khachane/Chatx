import React from "react";
import UseAvatar from "../Avatar/Avatar";
import { useAuth } from "../../context/AuthContext";
export default function Chatbar({ profileUrl, name,lastMessage,lastMessageSender,senderName }) {
  const {userInfo} = useAuth()
  return (
    <div className="outer hover:bg-[#e0e0e0] transition-all duration-500 cursor-pointer  flex gap-10 bg-[#fffffe] shadow-md/30 w-[100%] my-0.5 p-1 outline-none ">
      <UseAvatar
        profileUrl={profileUrl}
        
        styling="w-16 h-16 md:w-16 md:h-16 rounded-full shadow-md bg-gray-300"
      />
      <div className="inner flex flex-col gap-1 tracking-wide">
        <h3 className="text-lg text-[#272343] font-semibold font-[nunito]">
          {name}
        </h3>
        <p className="text-sm text-[#c3c3c3] font-[poppins]">{lastMessage ? lastMessageSender === userInfo.uid  ? "You :" : senderName.split(" ")[0] + " : " : ""}{lastMessage}</p>
      </div>
    </div>
  );
}
