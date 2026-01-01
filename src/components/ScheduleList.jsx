import React, { useState } from 'react';
import { db } from '../firebase';
import { deleteDoc, doc, updateDoc } from "firebase/firestore";

function ScheduleList({ 
  filteredSchedules, 
  filterMode, 
  setFilterMode, 
  searchMember, 
  setSearchMember, 
  members 
}) {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleDelete = async (id) => {
    if (window.confirm("確定刪除？")) {
      try {
        await deleteDoc(doc(db, "schedules", id));
      } catch (e) {
        alert("刪除失敗");
      }
    }
  };

  const startEdit = (item) => {
    setEditId(item.id);
    let formattedTime = item.time;
    // 確保時間格式為 HH:mm 以利 HTML5 time input 讀取
    if (item.time && item.time.length === 4 && item.time.includes(':')) {
        formattedTime = "0" + item.time;
    }
    setEditData({ 
      ...item, 
      time: formattedTime,
      platforms: item.platforms || { youtube: true, twitch: false }
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  const handleSave = async (id) => {
    if (!editData.topic || editData.topic.trim() === "") {
      alert("主題不能為空白！");
      return;
    }
    try {
      const docRef = doc(db, "schedules", id);
      await updateDoc(docRef, {
        topic: editData.topic.trim(),
        time: editData.time,
        period: editData.period,
        platforms: editData.platforms 
      });
      setEditId(null);
    } catch (e) {
      alert("更新失敗");
    }
  };

  const handlePlatformToggle = (selected) => {
    setEditData({
      ...editData,
      platforms: {
        youtube: selected === 'youtube',
        twitch: selected === 'twitch'
      }
    });
  };

  const isTopicEmpty = !editData.topic || editData.topic.trim() === "";

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3 d-flex flex-wrap justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <h5 className="fw-bold mb-0" style={{ color: '#D8BFD8' }}>行程詳細清單</h5>
          {filterMode === 'member' && (
            <select 
              className="form-select form-select-sm" 
              style={{ width: '180px', borderColor: '#D8BFD8' }} 
              value={searchMember} 
              onChange={(e) => setSearchMember(e.target.value)}
            >
              <option value="">顯示所有成員</option>
              {members.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
            </select>
          )}
        </div>
        <div className="btn-group btn-group-sm mt-2 mt-sm-0">
          <button 
            className={`btn ${filterMode === 'date' ? 'btn-primary' : 'btn-outline-primary'}`} 
            onClick={() => { setFilterMode('date'); setSearchMember(''); }}
          >
            日期模式
          </button>
          <button 
            className={`btn ${filterMode === 'member' ? 'btn-primary' : 'btn-outline-primary'}`} 
            onClick={() => { setFilterMode('member'); setSearchMember(''); }}
          >
            成員模式
          </button>
        </div>
      </div>
      
      <div className="table-responsive">
        <table className="table table-hover align-middle text-center mb-0">
          <thead className="table-light">
            <tr>
              {filterMode === 'member' && <th>日期</th>}
              <th>成員</th>
              <th>主題</th>
              <th>時間</th>
              <th>平台</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.length > 0 ? (
              filteredSchedules.map(item => {
                const memberData = members.find(m => m.name === item.userName);
                
                return (
                  <tr key={item.id}>
                    {filterMode === 'member' && <td className="small text-muted">{item.streamDate}</td>}
                    <td>
                      <div className="d-flex align-items-center justify-content-center">
                        {/* 修正 src="" 的警告：條件渲染圖片 */}
                        {memberData && memberData.img ? (
                          <img 
                            src={memberData.img} 
                            className="rounded-circle me-2 shadow-sm" 
                            style={{ width: '32px', height: '32px', objectFit: 'cover' }} 
                            alt="" 
                          />
                        ) : (
                          <div 
                            className="rounded-circle me-2 shadow-sm bg-light d-flex align-items-center justify-content-center text-secondary border"
                            style={{ width: '32px', height: '32px', fontSize: '10px' }}
                          >
                            <i className="bi bi-person"></i>
                          </div>
                        )}
                        <span className="fw-bold">{item.userName.split(' ')[0]}</span>
                      </div>
                    </td>

                    <td className="small">
                      {editId === item.id ? (
                        <input 
                          type="text" 
                          className={`form-control form-control-sm mx-auto ${isTopicEmpty ? 'is-invalid' : ''}`}
                          style={{ maxWidth: '150px' }}
                          value={editData.topic}
                          onChange={(e) => setEditData({...editData, topic: e.target.value})}
                        />
                      ) : (
                        item.topic
                      )}
                    </td>

                    <td className="small">
                      <div className="d-flex flex-column align-items-center">
                        {editId === item.id ? (
                          <>
                            <select 
                              className="form-select form-select-sm mb-1"
                              style={{ fontSize: '0.7rem' }}
                              value={editData.period}
                              onChange={(e) => setEditData({...editData, period: e.target.value})}
                            >
                              <option value="AM">上午</option>
                              <option value="PM">下午</option>
                            </select>
                            <input 
                              type="time" 
                              className="form-control form-control-sm text-center"
                              value={editData.time}
                              onChange={(e) => setEditData({...editData, time: e.target.value})}
                            />
                          </>
                        ) : (
                          <>
                            <span style={{ fontSize: '0.7rem', color: '#6c757d' }}>
                              {item.period === 'AM' ? '上午' : '下午'}
                            </span>
                            <span className="fw-bold">{item.time}</span>
                          </>
                        )}
                      </div>
                    </td>

                    <td>
                      {editId === item.id ? (
                        <div className="d-flex justify-content-center gap-2">
                          <div 
                            className="badge rounded-pill p-2 d-flex align-items-center justify-content-center"
                            style={{ 
                              cursor: 'pointer',
                              border: '2px solid #dc3545',
                              backgroundColor: editData.platforms?.youtube ? '#dc3545' : 'transparent',
                              transition: 'all 0.2s'
                            }}
                            onClick={() => handlePlatformToggle('youtube')}
                          >
                            <i className={`bi bi-youtube fs-6 ${editData.platforms?.youtube ? 'text-white' : 'text-danger'}`}></i>
                          </div>

                          <div 
                            className="badge rounded-pill p-2 d-flex align-items-center justify-content-center"
                            style={{ 
                              cursor: 'pointer',
                              border: '2px solid #6441a5',
                              backgroundColor: editData.platforms?.twitch ? '#6441a5' : 'transparent',
                              transition: 'all 0.2s'
                            }}
                            onClick={() => handlePlatformToggle('twitch')}
                          >
                            <i className={`bi bi-twitch fs-6 ${editData.platforms?.twitch ? 'text-white' : 'text-primary'}`}></i>
                          </div>
                        </div>
                      ) : (
                        <>
                          {item.platforms?.youtube && <i className="bi bi-youtube text-danger fs-5 mx-1"></i>}
                          {item.platforms?.twitch && <i className="bi bi-twitch text-primary fs-5 mx-1"></i>}
                        </>
                      )}
                    </td>

                    <td>
                      {editId === item.id ? (
                        <div className="d-flex justify-content-center gap-1">
                          <button 
                            className="btn btn-sm btn-success border-0" 
                            onClick={() => handleSave(item.id)}
                            disabled={isTopicEmpty}
                          >
                            <i className="bi bi-check-lg"></i>
                          </button>
                          <button className="btn btn-sm btn-secondary border-0" onClick={cancelEdit}>
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex justify-content-center gap-1">
                          <button className="btn btn-sm btn-outline-danger border-0" onClick={() => startEdit(item)}>
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger border-0" onClick={() => handleDelete(item.id)}>
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={filterMode === 'member' ? 6 : 5} className="py-4 text-muted small">
                  暫無行程資料
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ScheduleList;