import { useState, useEffect, useMemo } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, getDocs, where, addDoc } from "firebase/firestore";

export function useSchedules(filterMode, dateValue, searchMember) {
    const [scheduleList, setScheduleList] = useState([]);

  // Firebase 即時資料同步
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "schedules"), (snap) => {
      setScheduleList(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    });
    return () => unsubscribe();
  }, []);


// 使用 useMemo 優化過濾效能
  const filteredSchedules = useMemo(() => {
    return scheduleList
      .filter(i => {
        if (filterMode === 'date') {
          return i.streamDate === dateValue.toLocaleDateString('en-CA');
        } else {
          return searchMember ? i.userName === searchMember : true;
        }
      })
      .sort((a, b) => {
        return a.streamDate !== b.streamDate 
          ? b.streamDate.localeCompare(a.streamDate) 
          : a.time.localeCompare(b.time);
      });
  }, [scheduleList, filterMode, dateValue, searchMember]);


  // 封裝新增功能
  const addSchedule = async (formData) => {
    const q = query(collection(db, "schedules"),
      where("userName", "==", formData.userName),
      where("streamDate", "==", formData.streamDate),
      where("time", "==", formData.time),
      where("period", "==", formData.period)
    );
    const snap = await getDocs(q);
    if (!snap.empty) throw new Error("DUPLICATE_EVENT");

    return await addDoc(collection(db, "schedules"), formData);
  };

  return { scheduleList, filteredSchedules, addSchedule };
}

