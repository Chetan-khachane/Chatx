import React from "react";
import HamburgerMenu from "../HambergurMenu/HamburgerMenu";


export default function ProfileBar(){
    return (
         <div className={`container flex justify-between relative p-1 w-[30%] bg-[#34D1BF]`}>
            <HamburgerMenu/>
            <img className="h-16 w-16 bg-gray-400 rounded-full" src="" alt="Profile"/>
        </div>
    )
}