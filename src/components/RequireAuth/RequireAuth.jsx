import React,{useEffect} from "react";
import { Navigate,useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import LoadingScreen from "../LoadingScreen/LoadingScreen";

export default function RequireAuth({children,fallback=null,loginPath="/"}){
    const {user,loading} = useAuth()
    const location = useLocation();

   
    if(loading){ 
       
        return <LoadingScreen/>
    }

    if(!user){
        return <Navigate to={loginPath} state={{from:location.pathname}} replace/>
    }
    return children
}