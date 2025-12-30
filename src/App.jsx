import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './AppCustom.css';

// 匯入自定義 Hook
import { useMembers } from './hooks/useMembers';
import { useSchedules } from './hooks/useSchedules';

// 匯入組件
import AddEventForm from './components/AddEventForm';
import CalendarView from './components/CalendarView';
import ScheduleList from './components/ScheduleList';

function App() {
  // --- 1. 環境變數與配置 ---
  const API_KEY = (import.meta.env && import.meta.env.VITE_YOUTUBE_API_KEY) || process.env.REACT_APP_YOUTUBE_API_KEY;

  // --- 2. 狀態管理 ---
  const [dateValue, setDateValue] = useState(new Date());
  const [filterMode, setFilterMode] = useState('date');
  const [searchMember, setSearchMember] = useState('');
  const [memberSearchTerm, setMemberSearchTerm] = useState('');

  // 💡 修正處：完整定義所有欄位的初始值，避免 undefined 導致的警告
  const [formData, setFormData] = useState({
    userName: '',                                     // 初始為空字串
    streamDate: new Date().toLocaleDateString('en-CA'), // 預設今天 (YYYY-MM-DD)
    topic: '',                                        // 初始為空字串
    time: '20:00',                                    // 預設時間
    period: 'PM',                                     // 預設時段
    platforms: {
      youtube: false,
      twitch: false
    }
  });

  // --- 3. 使用自定義 Hook ---
  const members = useMembers(API_KEY);
  const { scheduleList, filteredSchedules, addSchedule } = useSchedules(filterMode, dateValue, searchMember);

  // --- 4. 處理提交 ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 驗證
    if (!formData.userName || !formData.topic.trim()) {
      return alert("請選擇成員並填寫主題！");
    }
    // 2. 💡 新增：檢查是否至少勾選了一個平台
    // 如果 youtube 是 false 且 twitch 也是 false，就跳出警告
    if (!formData.platforms.youtube && !formData.platforms.twitch) {
      return alert("請至少選擇一個直播平台 (YouTube 或 Twitch)！");
    }
    try {
      await addSchedule(formData);
      // 成功後重設部分欄位 (保留成員與日期，方便連續輸入)
      setFormData(prev => ({
        ...prev,
        topic: '',
        platforms: { youtube: false, twitch: false }
      }));
      alert("同步成功！");
    } catch (err) {
      console.error(err);
      alert(err.message === "DUPLICATE_EVENT" ? "該時段已有重複行程！" : "同步失敗！");
    }
  };

  // --- 5. 畫面渲染 ---
  return (
    <div className="container mt-4 mb-5 px-3">
      <h1 className="text-center fw-bold display-5 mb-2" style={{ color: '#D8BFD8' }}>
        MERIDIAN project
      </h1>
      <hr className="my-4" />

      <div className="row mb-5 g-4">
        {/* 右側：新增行程表單 */}
        <div className="col-lg-4 order-1 order-lg-2">
          <AddEventForm
            formData={formData}
            setFormData={setFormData}
            members={members}
            memberSearchTerm={memberSearchTerm}
            setMemberSearchTerm={setMemberSearchTerm}
            onSubmit={handleSubmit}
          />
        </div>

        {/* 左側：日曆檢視 */}
        <div className="col-lg-8 order-2 order-lg-1">
          <CalendarView
            dateValue={dateValue}
            setDateValue={setDateValue}
            scheduleList={scheduleList}
            members={members}
            setFilterMode={setFilterMode}
            setSearchMember={setSearchMember}
            setFormData={setFormData}
          />
        </div>
      </div>

      {/* 詳細列表清單 */}
      <ScheduleList
        filteredSchedules={filteredSchedules}
        filterMode={filterMode}
        setFilterMode={setFilterMode}
        searchMember={searchMember}
        setSearchMember={setSearchMember}
        members={members}
      />
    </div>
  );
}

export default App;