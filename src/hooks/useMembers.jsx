import { useState, useEffect } from "react";
import axios from "axios";

const MEMBER_CONFIG = [
  { id: 'UCjv4bfP_67WLuPheS-Z8Ekg', name: '浠Mizuki Channel' },
  { id: 'UCbTv4OeHE9p1akLhKfgW8WQ', name: '澪Rei Channel' },
  { id: 'UCZTw6BZCzfjCarjJMRpU0Wg', name: '煌Kirali Channel' },
  { id: 'UCxI5FyblWfEVBJDbSwRPzyw', name: '橙Yuzumi Channel' },
  { id: 'UCB3at_yiqFJh31c0ztE4MVA', name: '宵Yoruno' },
  { id: 'UCHVkG_htYhk-JmJ5RWYMXzw', name: '朔Sakuro Channel' },
  { id: 'UCjmLYMFRI56fZteeYu7kkpg', name: '朧Oboro Channel' },
  { id: 'UCs5FNYPHeZz5f7N1BDExxfg', name: '玖玖巴' },
  { id: 'UC2mtxQezpgWjqMXF6WkuMiw', name: '實Hitomi' },
  { id: 'UCyO8Nae_zF-OpxtbL01Dwow', name: '煦Hiyori' },
  { id: 'UC8zQumEzXBpWSmbHmr8wMKw', name: '雪Koyuki' },
  { id: 'UC6NXFJInhUYGdKeFHhPrtpA', name: '幸Sachi' }
];

// 使用具名導出 (Named Export)
export const useMembers = (API_KEY) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchYT = async () => {
      // 如果沒有 API_KEY，回傳只有名字的基礎資料，避免畫面崩潰
      if (!API_KEY) {
        setMembers(MEMBER_CONFIG.map(m => ({ 
          name: m.name, 
          img: "", 
          youtube: `https://www.youtube.com/channel/${m.id}` 
        })));
        return;
      }

      try {
        const ids = MEMBER_CONFIG.map(m => m.id).join(',');
        const res = await axios.get(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${ids}&key=${API_KEY}`
        );

        const fetchedItems = res.data.items || [];

        const updatedMembers = MEMBER_CONFIG.map(c => {
          // 尋找對應的 YouTube 頻道資訊
          const ytInfo = fetchedItems.find(i => i.id === c.id);
          
          return {
            name: c.name,
            id: c.id,
            // 取得頭像，若無則給空字串
            img: ytInfo?.snippet?.thumbnails?.default?.url || "",
            // 重要：預先產出 youtube 連結，解決 AddEventForm 找不到 youtube 屬性的問題
            youtube: `https://www.youtube.com/channel/${c.id}`
          };
        });

        setMembers(updatedMembers);
      } catch (e) {
        console.error("YouTube API 抓取失敗:", e);
        // 發生錯誤時的備案資料
        setMembers(MEMBER_CONFIG.map(m => ({ 
          name: m.name, 
          img: "", 
          youtube: `https://www.youtube.com/channel/${m.id}` 
        })));
      }
    };

    fetchYT();
  }, [API_KEY]);

  return members;
};