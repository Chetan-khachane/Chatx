import React from "react";
import Chatbar from "../ChatBar/Chatbar";
import AddFreinds from "../AddFreinds/AddFreinds";
import { useAuth } from "../../context/AuthContext";
export default function ChatList({ className, height, width ,freinds,setSelectedChat}) {
  const {friendStatuses,userChats} = useAuth()
 
  return (
      freinds && freinds.length > 0 ? 
      <div className="relative h-full shadow-xs/20 min-h-0">
        <ul
          className={`custom-scrollbar-rect overflow-y-auto h-full bg-[#e2e0dd] ${className}}`}
        > 
          {
            freinds.map((freind,key)=>{
              const currentChat = userChats.filter((chat)=>chat.id.includes(freind.freindUid))
              
            return <li key={key} onClick={()=>setSelectedChat(freind)}>
              <Chatbar profileUrl={freind.profileUrl} senderName={freind.name} lastMessage={currentChat[0]?.lastMessage} lastMessageSender={currentChat[0]?.lastSenderId} name={freind.name}/>
            </li>})  
          }
        </ul>
        <AddFreinds styling={"absolute bottom-3 right-5 z-1"}/>
      </div> : <div className="relative h-full  shadow-xs/20 a min-h-0 flex justify-center items-center"><p>No friends found</p>
      <AddFreinds styling={"absolute bottom-3 right-5 z-1"}/>
      </div>
  )
}
