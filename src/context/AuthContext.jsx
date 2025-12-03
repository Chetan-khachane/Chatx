// src/context/AuthContext.jsx
import React, { useContext, createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, storage } from "../config/firebase.js";
import {
  doc,
  getDoc,
  onSnapshot,
  collection,
  getDocs,
  updateDoc,
  arrayUnion,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";

const AuthContext = createContext({
  user: null,
  loading: true,
  userInfo: null,
  urls: null,
  profiles: null,
  freindRequests: null,
  userChats: [],
  friendStatuses: {},
});

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [urls, setUrls] = useState({});
  const [profiles, setProfiles] = useState({});
  const [freindRequests, setFreindRequests] = useState({});
  const [userChats, setUserChats] = useState([]);
  const [friendStatuses, setFriendStatuses] = useState({});


  useEffect(() => {
    const loadAlertUrls = async () => {
      try {
        const docRef = doc(db, "alerts", "alerts");
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setUrls(snap.data());
        } else {
          console.warn("alerts/alerts doc does not exist");
        }
      } catch (err) {
        console.error("Error loading alert urls:", err);
      }
    };

    loadAlertUrls();
  }, []);

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const snap = await getDocs(collection(db, "usernames"));
        const data = snap.docs.map((d) => ({ ...d.data(), phone: d.id }));
        setProfiles(data);
      } catch (err) {
        console.error("Error loading profiles:", err);
      }
    };

    loadProfiles();
  }, []);

  const updateSenderFreindList = async (acceptedAsSender, firebaseUser) => {
    if (acceptedAsSender.length > 0) {
      const meRef = doc(db, "Users", firebaseUser.uid);

      for (const req of acceptedAsSender) {
        await updateDoc(meRef, {
          FreindList: arrayUnion({
            freindUid: req.to_id,
            profileUrl: req.receiverProfileUrl,
            name: req.receiverName,
          }),
        });
      }
    }
  };

  useEffect(() => {
    let unsubSnapshot = null;
    let freindRequestsSnapShot = null;
    let chatsUnsub = null;

    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);

      // cleanup old listeners
      if (unsubSnapshot) {
        try {
          unsubSnapshot();
        } catch (e) {}
        unsubSnapshot = null;
      }
      if (freindRequestsSnapShot) {
        try {
          freindRequestsSnapShot();
        } catch (e) {}
        freindRequestsSnapShot = null;
      }
      if (chatsUnsub) {
        try {
          chatsUnsub();
        } catch (e) {}
        chatsUnsub = null;
      }

      // not logged in
      if (!firebaseUser) {
        setUserInfo({});
        setLoading(false);
        return;
      }

      
      const meRef = doc(db, "Users", firebaseUser.uid);
      updateDoc(meRef, {
        status: "online",
        lastSeen: new Date(),
      }).catch((e) => console.error("Failed to set online:", e));

      // user doc listener
      const userDocRef = doc(db, "Users", firebaseUser.uid);
      unsubSnapshot = onSnapshot(
        userDocRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            const {
              name,
              profileUrl,
              username,
              dob,
              Notification_settings,
              phone,
              FreindList,
            } = data;
            setUserInfo({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              phone,
              name,
              profileUrl,
              username,
              dob,
              Notification_settings,
              FreindList,
            });
          } else {
            setUserInfo({ uid: firebaseUser.uid, email: firebaseUser.email });
          }
          setLoading(false);
        },
        (err) => {
          console.error("onSnapshot error:", err);
          setUserInfo({ uid: firebaseUser.uid, email: firebaseUser.email });
          setLoading(false);
        }
      );

      // chats list listener
      const chatsRef = collection(db, "Chats");
      const chatsQuery = query(
        chatsRef,
        where("members", "array-contains", firebaseUser.uid),
        orderBy("lastMessageAt", "desc")
      );

      chatsUnsub = onSnapshot(
        chatsQuery,
        (snap) => {
          const chats = snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
          setUserChats(chats);
        },
        (err) => {
          console.error("Chats onSnapshot error:", err);
        }
      );

      // friend requests listener
      const freindRequestsRef = collection(db, "FreindRequests");
      freindRequestsSnapShot = onSnapshot(
        freindRequestsRef,
        (snap) => {
          const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

          const sent = all.filter((req) => req.from_id === firebaseUser.uid);
          const received = all.filter((req) => req.to_id === firebaseUser.uid);
          const acceptedRequest = sent.filter(
            (doc) => doc.status === "accepted"
          );

          updateSenderFreindList(acceptedRequest, firebaseUser);
          setFreindRequests({ sent, received });
        },
        (err) => {
          console.error("FreindRequests onSnapshot error:", err);
          setUserInfo({ uid: firebaseUser.uid, email: firebaseUser.email });
          setLoading(false);
        }
      );
    });

    return () => {
      try {
        unsubAuth();
      } catch (e) {}

      if (unsubSnapshot) {
        try {
          unsubSnapshot();
        } catch (e) {}
      }
      if (freindRequestsSnapShot) {
        try {
          freindRequestsSnapShot();
        } catch (e) {}
      }
      if (chatsUnsub) {
        try {
          chatsUnsub();
        } catch (e) {}
      }
    };
  }, []);

 
  useEffect(() => {
    if (!userInfo?.FreindList || userInfo.FreindList.length === 0) return;

    let unsubscribers = [];

    userInfo.FreindList.forEach((friend) => {
      const friendRef = doc(db, "Users", friend.freindUid);

      const unsub = onSnapshot(friendRef, (snap) => {
        if (!snap.exists()) return;
        const data = snap.data();

        setFriendStatuses((prev) => ({
          ...prev,
          [friend.freindUid]: {
            status: data.status || "offline",
            lastSeen: data.lastSeen || null,
          },
        }));
      });

      unsubscribers.push(unsub);
    });

    return () => {
      unsubscribers.forEach((fn) => fn && fn());
    };
  }, [userInfo?.FreindList]);

 
  useEffect(() => {
    if (!user?.uid) return;

    const userRef = doc(db, "Users", user.uid);

    const handleBeforeUnload = () => {
      updateDoc(userRef, {
        status: "offline",
        lastSeen: new Date(),
      }).catch(() => {});
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user?.uid]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        userInfo,
        urls,
        profiles,
        freindRequests,
        userChats,
        friendStatuses, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
