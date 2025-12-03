import React from "react";
import { useAuth } from "../../context/AuthContext";
import UseAvatar from "../Avatar/Avatar";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router";
export default function Profile(){
    const {user,userInfo,loading} = useAuth()
    const navigate = useNavigate()
    const handleSignOut = () => {
        try{
            signOut(auth)
            navigate("/")
        }catch(e){
            console.error("Error caused during signout")
        }
    }
    return (
        <div className="h-screen bg-[#fffffe] flex justify-center items-center">
            <div className="bg-[#e3f6f5] shadow-lg/20  rounded-md w-100 flex flex-col gap-10 items-center h-[70%] ">
                <UseAvatar  styling="w-30 mt-15 shadow-lg/30 h-30 bg-gray-300 " profileUrl={userInfo.profileUrl}/>
                <div className="flex-col text-[#272343] ml-5 font-[poppins] flex gap-5">
                    <h2>Name : {userInfo.name}</h2>
                    <span>Email Id : {userInfo.email}</span>
                    <span>Username : {userInfo.username}</span>
                    <span>Phone : {userInfo.phone}</span>
                </div>
                 <button onClick={handleSignOut} className="font-[montserrat] cursor-pointer hover:bg-red-500 transition-colors duration-500 bg-[#ffd803] p-3 shadow-2xl/40 rounded-md text-[#272343] font-semibold">Log out</button>
            </div>
        </div>
    )
}