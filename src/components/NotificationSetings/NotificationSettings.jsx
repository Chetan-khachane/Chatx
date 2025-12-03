import React, { useEffect, useState } from "react";
import SliderButton from "../SliderButton/SliderButton";
import { auth, db,storage } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext.jsx";
import { ref } from "firebase/storage";
import { updateDoc, doc } from "firebase/firestore";

export default function NotificationSettings() {
  
  const optionLabels = ["Messages", "Reactions", "Message Received"];
  const { user, userInfo, loading ,urls} = useAuth();
  const [Messages, setMessages] = useState(
    userInfo.Notification_settings
      ? userInfo.Notification_settings.Messages
      : true
  );
  const [Reactions, setReactions] = useState(
    userInfo.Notification_settings
      ? userInfo.Notification_settings.Reactions
      : true
  );
  const [Message_Recieved, setReceived] = useState(
    userInfo.Notification_settings
      ? userInfo.Notification_settings.Message_Recieved
      : true
  );
  const [alert,setAlert] = useState(urls.alert1)
  const docRef = doc(db, "Users", userInfo.uid);

  const submitSettings = async () => {
    try {
      if (!user) return; 
      const docRef = doc(db, "Users", userInfo.uid);
      await updateDoc(docRef, {
        Notification_settings: { Messages, Reactions, Message_Recieved },
        alert_selected : alert
      });
    } catch (e) {
      console.error("An error occured while updating....", e);
    }
  };
  useEffect(() => {
    if (userInfo) {
      submitSettings();
    }
  }, [Messages, Reactions, Message_Recieved,alert]);


  return (
    <div className="h-screen bg-[#fffffe] flex justify-center items-center">
      <div className="bg-[#e3f6f5] shadow-lg/20 p-6  rounded-md w-100 flex flex-col  items-center  ">
        <h1 className="font-[poppins] text-2xl font-bold text-[#272343]">
          Notification Settings
        </h1>
        <form className="flex mt-10 flex-col w-[100%] ml-5 font-[nunito]">
          <label htmlFor={`messages`} className="  w-full  flex my-2 h-7">
            <span>{"Messages"}</span>
            <SliderButton
              checkedValue={Messages}
              setValue={setMessages}
              activeNotchColor={"bg-white"}
              inActiveNotchColor={"bg-white"}
              defaultSliderColor={"bg-red-400"}
              activeSliderColor={"bg-[#00d492]"}
              shadowColor={"shadow-blue-800"}
              inA
            />
          </label>

          <label htmlFor={`Reactions`} className="  w-full  flex my-2 h-7">
            <span>{"Reactions"}</span>
            <SliderButton
              checkedValue={Reactions}
              setValue={setReactions}
              activeNotchColor={"bg-white"}
              inActiveNotchColor={"bg-white"}
              defaultSliderColor={"bg-red-400"}
              activeSliderColor={"bg-[#00d492]"}
              shadowColor={"shadow-blue-800"}
              inA
            />
          </label>

          <label
            htmlFor={`Message Recieved`}
            className="  w-full  flex my-2 h-7"
          >
            <span>{"Message Recieved"}</span>
            <SliderButton
              checkedValue={Message_Recieved}
              setValue={setReceived}
              activeNotchColor={"bg-white"}
              inActiveNotchColor={"bg-white"}
              defaultSliderColor={"bg-red-400"}
              activeSliderColor={"bg-[#00d492]"}
              shadowColor={"shadow-blue-800"}
              inA
            />
          </label>
        </form>
        <div className=" items-start mt-10 ml-5 w-full">
          <h3 className="font-bold">Notification tones</h3>
          <div className="flex gap-5 mt-2">
            <select className="w-18" onChange={(e)=>setAlert(e.target.value)}>
              <option value={urls.alert1}>Alert 1</option>
              <option value={urls.alert2}>Alert 2</option>
              <option value={urls.alert3}>Alert 3</option>
              <option value={urls.alert4}>Alert 4</option>
            </select>
            <button className="bg-[#fffffe] p-1 rounded-md shadow-xl hover:bg-[#f1f1f1]/90 cursor-pointer" onClick={()=>{
               new Audio(alert).play();
            }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeLinejoin="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
