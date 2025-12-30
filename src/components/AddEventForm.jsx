import React from 'react';

/**
 * AddEventForm 元件
 */
const AddEventForm = ({ 
  formData, 
  setFormData, 
  members, 
  memberSearchTerm, 
  setMemberSearchTerm, 
  onSubmit 
}) => {

  // 1. 調整時/分的邏輯
  const adjustTime = (type, amount) => {
    const timeStr = formData.time || "20:00";
    let [hour, minute] = timeStr.split(':').map(Number);
    
    if (type === 'hour') {
      hour = (hour + amount + 24) % 24;
    } else if (type === 'minute') {
      minute = (minute + amount + 60) % 60;
    }

    const newTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    setFormData({ 
      ...formData, 
      time: newTime,
      period: hour >= 12 ? 'PM' : 'AM' 
    });
  };

  // 2. 切換 AM/PM 的邏輯 (點擊上下箭頭觸發)
  const togglePeriod = () => {
    const currentPeriod = formData.period || 'PM';
    const newPeriod = currentPeriod === 'AM' ? 'PM' : 'AM';
    
    let [hour, minute] = (formData.time || "20:00").split(':').map(Number);
    
    // 自動轉換 24 小時制數值
    if (newPeriod === 'PM' && hour < 12) hour += 12;
    if (newPeriod === 'AM' && hour >= 12) hour -= 12;
    
    const newTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    setFormData({ 
      ...formData, 
      time: newTime, 
      period: newPeriod 
    });
  };

  return (
    <div className="card shadow-sm border-0 h-100 p-4">
      <h5 className="fw-bold mb-3" style={{ color: '#D8BFD8' }}>
        <i className="bi bi-plus-circle me-2"></i>新增行程
      </h5>

      <form onSubmit={onSubmit}>
        
        {/* --- 成員選擇 --- */}
        <div className="mb-3">
          <label className="form-label small fw-bold text-secondary">選擇成員</label>
          <input 
            type="text" 
            className="form-control form-control-sm mb-2" 
            placeholder="搜尋成員名字..." 
            value={memberSearchTerm} 
            onChange={e => setMemberSearchTerm(e.target.value)} 
          />
          <div className="border rounded bg-white" style={{ maxHeight: '150px', overflowY: 'auto' }}>
            <div className="list-group list-group-flush">
              {members
                .filter(m => m.name.toLowerCase().includes(memberSearchTerm.toLowerCase()))
                .map(m => (
                <button 
                  key={m.name} 
                  type="button" 
                  className={`list-group-item list-group-item-action d-flex align-items-center border-0 py-2 ${formData.userName === m.name ? 'active' : ''}`}
                  style={formData.userName === m.name ? { backgroundColor: '#D8BFD8', color: 'white' } : {}} 
                  onClick={() => setFormData({ ...formData, userName: m.name })}>
                  <img src={m.img} className="rounded-circle me-3 border shadow-sm" style={{ width: '28px', height: '28px', objectFit: 'cover' }} alt="" />
                  <span className="small fw-bold">{m.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* --- 日期與主題 --- */}
        <div className="mb-3">
          <label className="form-label small fw-bold text-secondary">日期</label>
          <input 
            type="date" 
            className="form-control" 
            value={formData.streamDate || ''} 
            onChange={e => setFormData({ ...formData, streamDate: e.target.value })} 
          />
        </div>

        <div className="mb-3">
          <label className="form-label small fw-bold text-secondary">開台主題</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="請輸入主題" 
            value={formData.topic || ''} 
            onChange={e => setFormData({ ...formData, topic: e.target.value })} 
          />
        </div>
        
        {/* --- 滾輪式時間選擇器 (時、分、AM/PM) --- */}
        <div className="mb-4">
          <label className="form-label small fw-bold text-secondary d-block">開台時間</label>
          <div className="d-flex align-items-center justify-content-center bg-light p-3 rounded border shadow-sm">
            
            {/* 小時 */}
            <div className="text-center px-2">
              <button type="button" className="btn btn-sm btn-link p-0 d-block mx-auto text-decoration-none" 
                onClick={() => adjustTime('hour', 1)} style={{ color: '#D8BFD8' }}>
                <i className="bi bi-chevron-up fs-5"></i>
              </button>
              <div className="fw-bold" style={{ fontSize: '1.4rem', width: '40px' }}>
                {(formData.time || "20:00").split(':')[0]}
              </div>
              <button type="button" className="btn btn-sm btn-link p-0 d-block mx-auto text-decoration-none" 
                onClick={() => adjustTime('hour', -1)} style={{ color: '#D8BFD8' }}>
                <i className="bi bi-chevron-down fs-5"></i>
              </button>
            </div>

            <span className="fw-bold fs-4 mx-1" style={{ color: '#D8BFD8' }}>:</span>

            {/* 分鐘 */}
            <div className="text-center px-2">
              <button type="button" className="btn btn-sm btn-link p-0 d-block mx-auto text-decoration-none" 
                onClick={() => adjustTime('minute', 15)} style={{ color: '#D8BFD8' }}>
                <i className="bi bi-chevron-up fs-5"></i>
              </button>
              <div className="fw-bold" style={{ fontSize: '1.4rem', width: '40px' }}>
                {(formData.time || "20:00").split(':')[1]}
              </div>
              <button type="button" className="btn btn-sm btn-link p-0 d-block mx-auto text-decoration-none" 
                onClick={() => adjustTime('minute', -15)} style={{ color: '#D8BFD8' }}>
                <i className="bi bi-chevron-down fs-5"></i>
              </button>
            </div>

            {/* AM/PM (上下箭頭版) */}
            <div className="text-center px-2 ms-2 border-start ps-3">
              <button type="button" className="btn btn-sm btn-link p-0 d-block mx-auto text-decoration-none" 
                onClick={togglePeriod} style={{ color: '#D8BFD8' }}>
                <i className="bi bi-chevron-up fs-5"></i>
              </button>
              <div className="fw-bold" style={{ fontSize: '1.2rem', width: '45px', color: '#D8BFD8' }}>
                {formData.period || 'PM'}
              </div>
              <button type="button" className="btn btn-sm btn-link p-0 d-block mx-auto text-decoration-none" 
                onClick={togglePeriod} style={{ color: '#D8BFD8' }}>
                <i className="bi bi-chevron-down fs-5"></i>
              </button>
            </div>
          </div>
        </div>

        {/* --- 平台選擇 --- */}
        <div className="text-center mb-4">
          <div className="form-check form-check-inline">
            <input 
              className="form-check-input" 
              type="checkbox" 
              checked={formData.platforms?.youtube || false} 
              onChange={e => setFormData({ ...formData, platforms: { youtube: e.target.checked, twitch: false } })} 
            />
            <label className="form-check-label small"><i className="bi bi-youtube text-danger"></i> YT</label>
          </div>

          <div className="form-check form-check-inline">
            <input 
              className="form-check-input" 
              type="checkbox" 
              checked={formData.platforms?.twitch || false} 
              onChange={e => setFormData({ ...formData, platforms: { youtube: false, twitch: e.target.checked } })} 
            />
            <label className="form-check-label small"><i className="bi bi-twitch text-primary"></i> Twitch</label>
          </div>
        </div>

        <button className="btn text-white w-100 fw-bold py-2 shadow-sm" type="submit" style={{ backgroundColor: '#D8BFD8' }}>
          確認同步
        </button>
      </form>
    </div>
  );
};

export default AddEventForm;