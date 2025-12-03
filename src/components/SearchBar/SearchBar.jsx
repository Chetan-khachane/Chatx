import { list } from "firebase/storage";
import React, { use, useEffect, useState } from "react";

export default function SearchBar({className,width,freindList,listSetter}) {
  const [searchTerm,setSearchTerm] = useState("")

  useEffect(()=>{
    if(searchTerm){
      listSetter(freindList.filter((freind)=>freind.name.toLowerCase().includes(searchTerm.toLowerCase()) || freind.name.toLowerCase().startsWith(searchTerm.toLowerCase())))
    }else{
      listSetter(freindList)
    }
  },[searchTerm])
  return (
    <div className={`container bg-[#bae8e8] w-[100%] p-2 ${className}`}>
      <form className="relative  rounded-lg shadow-md">
        <input
          type="text"
          name="search"
          aria-label="Search Chats"
          placeholder="Search Chats"
          className="w-full p-3 pr-10 text-lg text-[#272343] bg-[#fffffe] rounded-sm outline-none placeholder-[#272343]"
          onChange={(e)=>setSearchTerm(e.target.value)}
        />
      </form>
    </div>
  );
}
