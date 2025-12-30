import React from 'react';
import Calendar from 'react-calendar';

function CalendarView({ dateValue, setDateValue, scheduleList, members, setFilterMode, setSearchMember, setFormData }) {
  
  // 處理點擊日期的邏輯
  const handleDateChange = (v) => {
    setDateValue(v);
    setFilterMode('date');
    setSearchMember('');
    setFormData(p => ({ ...p, streamDate: v.toLocaleDateString('en-CA') }));
  };

  // 渲染日曆格子內的內容
  const renderTileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toLocaleDateString('en-CA');
      const dailySchedules = scheduleList.filter(s => s.streamDate === dateStr);

      if (dailySchedules.length > 0) {
        return (
          <div className="tile-avatar-scroll-y">
            {dailySchedules.map((sched, idx) => {
              const memberImg = members.find(m => m.name === sched.userName)?.img;
              return memberImg ? (
                <img
                  key={idx}
                  src={memberImg}
                  className="rounded-circle border border-white shadow-sm mb-1"
                  style={{ width: '26px', height: '26px', objectFit: 'cover', display: 'block', margin: '0 auto' }}
                  alt={sched.userName}
                />
              ) : null;
            })}
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div className="p-4 shadow-sm rounded bg-white border h-100 text-center">
      <h5 className="fw-bold mb-3" style={{ color: '#D8BFD8' }}>
        <i className="bi bi-calendar3 me-2"></i>日曆檢視
      </h5>
      <Calendar
        onChange={handleDateChange}
        value={dateValue}
        locale="zh-TW"
        className="w-100 border-0"
        tileContent={renderTileContent}
      />
    </div>
  );
}

export default CalendarView;