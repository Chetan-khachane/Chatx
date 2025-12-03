import React, { useState } from "react";
import HamburgerMenu from "./HambergurMenu/HamburgerMenu";
import ChatList from "./ChatList/ChatList";
import SearchBar from "./SearchBar/SearchBar";
import ChatArea from "./ChatArea/ChatArea";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
export default function Home(){
    const {userInfo} = useAuth()
    const [searchFreinds,setSearchFreinds] = useState(userInfo.FreindList)
    const [selectedChat,setSelectedChat] = useState("")
    return (
        <div className="grid grid-cols-[1fr_2fr] grid-rows-[72px_1fr_72px] h-screen ">
            <HamburgerMenu className="col-start-1 col-end-2 row-start-1 row-end-2"/>
            <ChatList setSelectedChat={setSelectedChat} freinds={searchFreinds} className="col-start-1 col-end-2 row-start-2 row-end-3 min-h-0"/>
            <SearchBar searchFreinds={searchFreinds} freindList={userInfo.FreindList} listSetter={setSearchFreinds} className="col-start-1 col-end-2 row-start-3 row-end-4"/>
            <ChatArea selectedFriend={selectedChat} className="col-start-2 col-end-3 row-start-1 row-end-4"/>
            <Outlet/>
        </div>
    )
}

/*
Task needed to do : ::
    create loading screen -- done
    notifiers : 
    when user enter wrong creds in login form then notify you were wrong -- done
    notifications : 
    show online offline status on profile pics of person and in chatarea describe it with text -- done
    show last message in chatlist -- done
    on clicking profile pic in chatroom,person profile page should be opened -- done
    optional : live deployment
*/