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
import Login from './components/Login';

function App() {
  // --- 1. 環境變數 ---
  // 提醒：上傳 GitHub 前請確認 API KEY 是透過環境變數讀取
  const API_KEY = (import.meta.env && import.meta.env.VITE_YOUTUBE_API_KEY) || process.env.REACT_APP_YOUTUBE_API_KEY;

  // --- 2. 登入與團體狀態 ---
  // user 為 null 時顯示登入頁；登入後為 { group: 'meridian'|'springfish', email: '...' }
  const [user, setUser] = useState(null);

  // --- 3. 介面狀態管理 ---
  const [dateValue, setDateValue] = useState(new Date());
  const [filterMode, setFilterMode] = useState('date');
  const [searchMember, setSearchMember] = useState('');
  const [memberSearchTerm, setMemberSearchTerm] = useState('');

  // 表單初始狀態
  const [formData, setFormData] = useState({
    userName: '',
    streamDate: new Date().toLocaleDateString('en-CA'),
    topic: '',
    time: '20:00',
    period: 'PM',
    platforms: {
      youtube: false,
      twitch: false
    }
  });

  // --- 4. 根據登入團體獲取資料 ---
  // 如果尚未登入，這部分不會被執行到渲染層，但 Hook 必須寫在最上層
  const currentGroup = user?.group || 'meridian';
  const members = useMembers(API_KEY, currentGroup);
  const { scheduleList, filteredSchedules, addSchedule } = useSchedules(
    filterMode, 
    dateValue, 
    searchMember, 
    currentGroup
  );

  // --- 5. 邏輯處理 ---

  // 處理登出
  const handleLogout = () => {
    if (window.confirm("確定要登出並切換團隊嗎？")) {
      setUser(null);
      // 登出時重設表單，避免殘留上次的資料
      setFormData({
        userName: '',
        streamDate: new Date().toLocaleDateString('en-CA'),
        topic: '',
        time: '20:00',
        period: 'PM',
        platforms: { youtube: false, twitch: false }
      });
    }
  };

  // 處理新增行程提交
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 驗證
    if (!formData.userName || !formData.topic.trim()) {
      return alert("請選擇成員並填寫主題！");
    }
    if (!formData.platforms.youtube && !formData.platforms.twitch) {
      return alert("請至少選擇一個直播平台 (YouTube 或 Twitch)！");
    }

    try {
      // 💡 關鍵：儲存時自動帶入當前登入的團體標記
      await addSchedule({
        ...formData,
        group: currentGroup 
      });

      // 成功後重設部分欄位
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

  // --- 6. 權限檢查渲染 ---
  if (!user) {
    return <Login onLogin={(userData) => setUser(userData)} />;
  }

  // --- 7. 主程式畫面 ---
  return (
    <div className="container mt-4 mb-5 px-3">
      {/* 頁首：標題與團隊資訊 */}
      <div className="d-flex justify-content-between align-items-end mb-2">
        <div>
          <h1 className="fw-bold display-5 mb-0" style={{ color: '#D8BFD8' }}>
            {currentGroup === 'meridian' ? 'MERIDIAN project' : 'Spring Fish 春魚'}
          </h1>
          <span className="badge bg-light text-dark border mt-2">
            管理員已登入：{user.group}
          </span>
        </div>
        <button className="btn btn-outline-danger btn-sm mb-1" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-1"></i> 登出切換
        </button>
      </div>

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