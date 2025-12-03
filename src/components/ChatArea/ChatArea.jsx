import React, { useEffect, useState } from "react";
import ChatTile from "../ChatTile/ChatTile";
import UseAvatar from "../Avatar/Avatar";
import { db } from "../../config/firebase.js";
import "./Chat.css";
import {
  doc,
  setDoc,
  addDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { Timestamp } from "firebase/firestore";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router";

function generateChatKey() {
  return CryptoJS.lib.WordArray.random(32).toString(); // 256-bit
}

function encryptWithKey(plainText, chatKey) {
  return CryptoJS.AES.encrypt(plainText, chatKey).toString();
}

function decryptWithKey(cipherText, chatKey) {
  const bytes = CryptoJS.AES.decrypt(cipherText, chatKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

function getChatId(myUid, friendUid) {
  return myUid < friendUid ? `${myUid}_${friendUid}` : `${friendUid}_${myUid}`;
}

export default function ChatArea({ className, height, selectedFriend }) {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const { userInfo,friendStatuses } = useAuth();
  const navigate = useNavigate()

  useEffect(() => {
    const createChatRoomIfNeeded = async () => {
      if (!selectedFriend || !userInfo?.uid) return;

      const chatId = getChatId(userInfo.uid, selectedFriend.freindUid);
      const chatRef = doc(db, "Chats", chatId);
      const chatSnap = await getDoc(chatRef);

      if (chatSnap.exists()) return;

      await setDoc(chatRef, {
        members: [userInfo.uid, selectedFriend.freindUid],
        chatKey: generateChatKey(),
        lastMessage: "",
        lastMessageAt: null,
        lastSenderId: null,
        createdAt: Timestamp.now(),
      });
    };

    createChatRoomIfNeeded().catch(console.error);
  }, [selectedFriend, userInfo?.uid]);

  useEffect(() => {
    if (!selectedFriend || !userInfo?.uid) return;

    const chatId = getChatId(userInfo.uid, selectedFriend.freindUid);
    const chatRef = doc(db, "Chats", chatId);

    let unsub;

    const init = async () => {
      const chatSnap = await getDoc(chatRef);
      if (!chatSnap.exists()) {
        setMessages([]);
        return;
      }

      const chatKey = chatSnap.data().chatKey;

      const messagesRef = collection(db, "Chats", chatId, "messages");
      const q = query(messagesRef, orderBy("createdAt", "asc"));

      unsub = onSnapshot(q, (snap) => {
        const updated = snap.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            senderId: data.senderId,
            text: decryptWithKey(data.ciphertext || data.text, chatKey),
            createdAt: data.createdAt,
          };
        });
        setMessages(updated);
      });
    };

    init().catch(console.error);

    return () => {
      if (unsub) unsub();
    };
  }, [selectedFriend, userInfo?.uid]);

  const sendMessage = async () => {
    try {
      if (!selectedFriend || !userInfo?.uid) return;
      if (!chatInput.trim()) return;

      const chatId = getChatId(userInfo.uid, selectedFriend.freindUid);
      const chatRef = doc(db, "Chats", chatId);
      let chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          members: [userInfo.uid, selectedFriend.freindUid],
          chatKey: generateChatKey(),
          lastMessage: "",
          lastMessageAt: null,
          lastSenderId: null,
          createdAt: Timestamp.now(),
        });
        chatSnap = await getDoc(chatRef);
      }

      const chatKey = chatSnap.data().chatKey;
      const cipherText = encryptWithKey(chatInput, chatKey);

      const messageRef = collection(db, "Chats", chatId, "messages");
      await addDoc(messageRef, {
        senderId: userInfo.uid,
        ciphertext: cipherText,
        createdAt: Timestamp.now(),
      });

      await updateDoc(chatRef, {
        lastMessage: chatInput.slice(0, 15),
        lastMessageAt: Timestamp.now(),
        lastSenderId: userInfo.uid,
      });

      setChatInput("");
    } catch (e) {
      console.error("Error caused : ", e);
    }
  };

  if (!selectedFriend) {
    return (
      <div
        className={`w-full justify-center items-center flex pt-4 pl-1 pr-5 ${className} bg-[#fffffe]`}
      >
        <p>No Selected Chat</p>
      </div>
    );
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault(); // stop newline
      sendMessage();
    }
  };

  return (
    <div
      className={`w-[100%] container justify-between flex pt-4 pl-1 pr-5 flex-col ${className} bg-[#fffffe]`}
    >
      <div className="indicator flex gap-8 bg-[#272343] rounded-full cursor-pointer p-2 w-[40%] pl-3 ml-2">
        <div className="relative" onClick={()=>{
          navigate("/FreindProfile",{
              state: {
                friend: selectedFriend,
                from: "chat",
              },
          })
        }}>
          <UseAvatar
            profileUrl={selectedFriend.profileUrl}
            styling="w-16 h-16 md:w-16 md:h-16 rounded-full shadow-md bg-gray-300"
          />
          <div className={`rounded-full h-3 w-3 ${friendStatuses[selectedFriend.freindUid].status === "online" ? "bg-[#00ff0d]" : "bg-red-500"}  absolute right-1 bottom-1`}></div>
        </div>

        <div className="mt-1.5 tracking-wider font-[raleway] font-semibold">
          <h3 className="text-lg text-[#fffffe] ">{selectedFriend.name}</h3>
          <h6 className="text-gray-300 text-xs">{friendStatuses[selectedFriend.freindUid].status}</h6>
        </div>
      </div>

      <ul
        className="chatsection 
    p-5 
    flex-1 
    overflow-y-auto 
    max-h-[70vh] 
    scrollbar-hide"
      >
        {messages.map((message) => (
          <li
            className={`mt-5 flex ${
              message.senderId === userInfo.uid
                ? "justify-end"
                : "justify-start"
            }`}
            key={message.id}
          >
            <ChatTile
              sender={message.senderId}
              message={message.text}
              time={message.createdAt}
              receiver={selectedFriend}
            />
          </li>
        ))}
      </ul>

      <div className="textArea relative">
        <textarea
          style={{ resize: "none", width: "100%" }}
          value={chatInput}
          onKeyDown={handleKeyDown}
          onChange={(e) => setChatInput(e.target.value)}
          className="pr-20 pl-10 pt-3.5 h-15 text-pink-500 bg-[#fffffe] text-lg outline-none shadow-2xl/75"
          placeholder="Type your message...(press Shift + Enter to send message)"
        />
        <button
          className="absolute cursor-pointer right-7 top-[28%]"
          onClick={sendMessage}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="#4fc4cf"
            height="25px"
            width="25px"
            version="1.1"
            viewBox="0 0 512.001 512.001"
            xmlSpace="preserve"
          >
            {" "}
            <g>
              {" "}
              <g>
                {" "}
                <path d="M483.927,212.664L66.967,25.834C30.95,9.695-7.905,42.023,1.398,80.368l21.593,89.001 c3.063,12.622,11.283,23.562,22.554,30.014l83.685,47.915c6.723,3.85,6.738,13.546,0,17.405l-83.684,47.915 c-11.271,6.452-19.491,17.393-22.554,30.015l-21.594,89c-9.283,38.257,29.506,70.691,65.569,54.534l416.961-186.83 C521.383,282.554,521.333,229.424,483.927,212.664z M359.268,273.093l-147.519,66.1c-9.44,4.228-20.521,0.009-24.752-9.435 c-4.231-9.44-0.006-20.523,9.434-24.752l109.37-49.006l-109.37-49.006c-9.44-4.231-13.665-15.313-9.434-24.752 c4.229-9.44,15.309-13.666,24.752-9.435l147.519,66.101C373.996,245.505,374.007,266.49,359.268,273.093z" />{" "}
              </g>{" "}
            </g>{" "}
          </svg>
        </button>
      </div>
    </div>
  );
}
