// context/MyKidsContext.js
import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";

export const MyKidsContext = createContext();

const STORAGE_KEY = "SELECTED_CHILD_ID";
const SCHOOL_ID = "minnconnect";

export function MyKidsProvider({ children }) {
  const [kids, setKids] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore previously selected kid
  const restoreSelectedKid = async (kidsList) => {
    try {
      const savedKidId = await AsyncStorage.getItem(STORAGE_KEY);
      const found = kidsList.find((k) => k.id === savedKidId);

      if (found) {
        setSelectedChild(found);
      } else if (kidsList.length > 0) {
        setSelectedChild(kidsList[0]);
        await AsyncStorage.setItem(STORAGE_KEY, kidsList[0].id);
      } else {
        setSelectedChild(null);
      }
    } catch (e) {
      setSelectedChild(kidsList[0] || null);
    } finally {
      setLoading(false);
    }
  };

  // Live load kids for the logged-in parent
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setKids([]);
        setSelectedChild(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      const qKids = query(
        collection(db, "schools", SCHOOL_ID, "students"),
        where("parentUid", "==", user.uid)
      );

      const unsubKids = onSnapshot(qKids, async (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setKids(list);
        await restoreSelectedKid(list);
      });

      // cleanup kids listener when auth changes
      return unsubKids;
    });

    return () => unsubAuth();
  }, []);

  const changeSelectedChild = async (kid) => {
    setSelectedChild(kid);
    await AsyncStorage.setItem(STORAGE_KEY, kid.id);
  };

  if (loading) return null;

  return (
    <MyKidsContext.Provider
      value={{
        kids,
        selectedChild,
        setSelectedChild: changeSelectedChild,
      }}
    >
      {children}
    </MyKidsContext.Provider>
  );
}
