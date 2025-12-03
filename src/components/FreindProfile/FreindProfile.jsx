import React from "react";
import { useAuth } from "../../context/AuthContext";
import UseAvatar from "../Avatar/Avatar";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import { useLocation, useNavigate } from "react-router";
export default function FreindProfile(){
    const location = useLocation()
    const {friend,from} = location.state || {}
    return (
        <div className="h-screen bg-[#fffffe] flex justify-center items-center">
            <div className="bg-[#e3f6f5] shadow-lg/20  rounded-md w-100 flex flex-col gap-10 items-center h-[70%] ">
                <UseAvatar  styling="w-30 mt-15 shadow-lg/30 h-30 bg-gray-300 "  profileUrl={friend.profileUrl}/>
                <div className="flex-col text-[#272343] ml-5 font-[poppins] flex gap-5">
                    <h2>Name : {friend.name}</h2>
                </div>
            </div>
        </div>
    )
}