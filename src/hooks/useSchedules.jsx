import { useState, useEffect, useMemo } from "react";
import { db } from "../firebase";
import { 
  collection, 
  onSnapshot, 
  query, 
  getDocs, 
  where, 
  addDoc 
} from "firebase/firestore";

export function useSchedules(filterMode, dateValue, searchMember, currentGroup) {
  const [scheduleList, setScheduleList] = useState([]);

  useEffect(() => {
    // 1. 監聽時只抓取當前團體的行程
    // 確保 currentGroup 存在才啟動監聽
    if (!currentGroup) return;

    const q = query(
      collection(db, "schedules"), 
      where("group", "==", currentGroup)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ ...d.data(), id: d.id }));
      setScheduleList(docs);
    });

    return () => unsubscribe();
  }, [currentGroup]);

  const filteredSchedules = useMemo(() => {
    return scheduleList
      .filter(i => {
        if (filterMode === 'date') {
          // 日期模式：比對 streamDate 是否等於日曆選中的日期 (格式: YYYY-MM-DD)
          const targetDate = dateValue.toLocaleDateString('en-CA');
          return i.streamDate === targetDate;
        } else {
          // 成員模式：
          // 如果 searchMember 是空的，代表「顯示所有成員」，回傳 true
          // 如果有選成員，則比對 userName
          return searchMember === "" ? true : i.userName === searchMember;
        }
      })
      .sort((a, b) => {
        // 排序邏輯：日期由新到舊 (降冪)，若日期相同則按時間由早到晚 (升冪)
        if (a.streamDate !== b.streamDate) {
          return b.streamDate.localeCompare(a.streamDate);
        }
        return a.time.localeCompare(b.time);
      });
  }, [scheduleList, filterMode, dateValue, searchMember]);

  const addSchedule = async (formData) => {
    // 防重複檢查：檢查同一個人在同一天同一時間是否已有行程
    const q = query(
      collection(db, "schedules"),
      where("group", "==", currentGroup),
      where("userName", "==", formData.userName),
      where("streamDate", "==", formData.streamDate),
      where("time", "==", formData.time)
    );
    
    const snap = await getDocs(q);
    if (!snap.empty) throw new Error("DUPLICATE_EVENT");

    // 存檔時強制寫入當前所屬的 group
    return await addDoc(collection(db, "schedules"), { 
      ...formData, 
      group: currentGroup,
      createdAt: new Date() // 建議增加一個建立時間欄位備查
    });
  };

  return { scheduleList, filteredSchedules, addSchedule };
}