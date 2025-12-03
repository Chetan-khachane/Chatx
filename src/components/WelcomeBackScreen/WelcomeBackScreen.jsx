import React, { useEffect } from "react"; 
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import UseAvatar from "../Avatar/Avatar";
export default function WelcomeBackScreen(){
    const {user,userInfo,loading} = useAuth()
    return(
        <div className="outer flex justify-center items-center h-screen">
            <div className="inner bg-[#F1E9DA]  h-[70%] w-[30%] rounded-lg shadow-2xl">
                <form onSubmit={(e)=>{e.preventDefault()}} className="flex flex-col justify-evenly items-center w-[100%] h-[100%]">
                    <UseAvatar  styling="w-35 h-35 border-2" profileUrl={userInfo.profileUrl}/>
                    <h1 className="relative top-15 font-semibold text-[#D1345B] text-2xl">Welcome Back {userInfo.name}</h1>
                    <button className="mt-8 p-3 border-none bg-[#53FF45] rounded-2xl text-xl text-[#544e4e] 
                                        cursor-pointer shadow-lg shadow-blue-500/30 
                                        hover:-translate-y-2 transition-all font-medium"><Link to={"/home"}>Click to Continue</Link></button>
                </form>
            </div>
        </div>
    )
}