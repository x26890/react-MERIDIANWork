import { useState, useEffect } from "react";
import axios from "axios";

const GROUP_CONFIGS = {
  meridian: [
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
  ],
  springfish: [
    { id: 'UCIf6cffSRZqS7TUXbUAK_hw', name: '熙歌 Cygnus' },
    { id: 'UCwzpXmWAFEVKH3VzwvSlY_w', name: '厄倫蒂兒 Erendira' },
    { id: 'UCLeyYlqnD5k1fbZIIE4eTsg', name: '埃穆亞 Muya' },
    { id: 'UCFiIsVOC1p_gfTYDYXXfl4g', name: '涅默 Nemesis' }
  ]
};

export const useMembers = (API_KEY, currentGroup) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchYT = async () => {
      const config = GROUP_CONFIGS[currentGroup] || [];
      if (!API_KEY) {
        setMembers(config.map(m => ({ name: m.name, img: "", youtube: `https://www.youtube.com/channel/${m.id}` })));
        return;
      }
      try {
        const ids = config.map(m => m.id).join(',');
        const res = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${ids}&key=${API_KEY}`);
        const fetchedItems = res.data.items || [];
        setMembers(config.map(c => {
          const ytInfo = fetchedItems.find(i => i.id === c.id);
          return {
            name: c.name,
            id: c.id,
            img: ytInfo?.snippet?.thumbnails?.default?.url || "",
            youtube: `https://www.youtube.com/channel/${c.id}`
          };
        }));
      } catch (e) {
        setMembers(config.map(m => ({ name: m.name, img: "", youtube: `https://www.youtube.com/channel/${m.id}` })));
      }
    };
    fetchYT();
  }, [API_KEY, currentGroup]);

  return members;
};