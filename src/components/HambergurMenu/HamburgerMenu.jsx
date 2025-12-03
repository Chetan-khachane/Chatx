import React, { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import UseAvatar from "../Avatar/Avatar";
import FreindRequestList from "../FreindRequestList/FreindRequestList";
export default function HamburgerMenu({className}){
    const [isOpen,setIsOpen] = useState(false);
    const [requestListOpen,setRequestListOpen] = useState(false)
    const {freindRequests} = useAuth()
    function handleMenu(){
        setIsOpen(!isOpen);
    }
    const {user,userInfo,loading} = useAuth()
    return (
        <div className={`${className} relative p-1.5 bg-[#ffd803] shadow-xl`}>
            <div className={`${isOpen ? "absolute  top-25  right-4 z-4" : "mt-1.5 "}`}>
                <button className="outline-none border-none item-center 
                font-bold p-2 flex flex-col
                 z-30 gap-1.5 justify-between cursor-pointer"
                 onClick={handleMenu}
                 >
                    <span className={`h-2 rounded-lg w-10 bg-[#272343] block transition-all  duration-800 ${!isOpen ? "" : "rotate-45 translate-y-3.5"}`}/>
                    <span className={`h-2 rounded-lg w-10 bg-[#272343] block transition-opacity duration-300 ${isOpen ? "opacity-0" : ""}`}/>
                    <span className={`h-2 rounded-lg w-10 bg-[#272343] block transition-all duration-800 ${!isOpen ? "" : "-rotate-45 -translate-y-3.5"}`}/>
                </button>
            </div>
            <UseAvatar notificationAvailable={freindRequests.received?.filter((req)=>req.status === "pending").length > 0} styling="bg-gray-400 h-15 w-15 z-3 rounded-full " listEnabled={true} listOpener={setRequestListOpen}/>
            <FreindRequestList  listEnabled={requestListOpen}
        onClose={() => setRequestListOpen(false)}/>
            <div className={`${isOpen ? "left-0 opacity-100" : " -left-[100%] opacity-0 "} 
    transition-all 
    ease-in-out 
    duration-1000 
    z-2 absolute h-screen
    bg-[#F5BF0F]
    top-0
    w-[100%]
    `}>
                <h1 className="font-bold text-[#272343] text-4xl mt-25 ml-3">Settings</h1>
                <ul className="mt-20 ml-0 text-2xl text-white font-bold flex flex-col gap-3 cursor-pointer">
                    <li className="hover:bg-[#ffd803] hover:shadow-emerald-400 hover:shadow-xl/40 p-4 transition-colors duration-700"><Link to={"/home/profile"}>Profile</Link></li>
                    <li className="hover:bg-[#ffd803] hover:shadow-emerald-400 hover:shadow-xl/40 p-4 transition-colors duration-700">Privacy Options</li>
                    <li className="hover:bg-[#ffd803] hover:shadow-emerald-400 hover:shadow-xl/40 p-4 transition-colors duration-700"><Link to={"/home/notify"}>Notification Settings</Link></li>
                    <li className="hover:bg-[#ffd803] hover:shadow-emerald-400 hover:shadow-xl/40 p-4 transition-colors duration-700">Preferences</li>
                </ul>
            </div>
        </div>
        
    )
}