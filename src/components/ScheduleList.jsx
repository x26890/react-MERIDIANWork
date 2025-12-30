import React from 'react';
import { db } from '../firebase'; // 請確認路徑
import { deleteDoc, doc } from "firebase/firestore";

function ScheduleList({ 
  filteredSchedules, 
  filterMode, 
  setFilterMode, 
  searchMember, 
  setSearchMember, 
  members 
}) {

  const handleDelete = async (id) => {
    if (window.confirm("確定刪除？")) {
      try {
        await deleteDoc(doc(db, "schedules", id));
      } catch (e) {
        alert("刪除失敗");
      }
    }
  };

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
            onClick={() => setFilterMode('member')}
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
              filteredSchedules.map(item => (
                <tr key={item.id}>
                  {filterMode === 'member' && <td className="small text-muted">{item.streamDate}</td>}
                  <td>
                    <div className="d-flex align-items-center justify-content-center">
                      <img 
                        src={members.find(m => m.name === item.userName)?.img || ""} 
                        className="rounded-circle me-2 shadow-sm" 
                        style={{ width: '32px', height: '32px', objectFit: 'cover' }} 
                        alt="" 
                      />
                      <span className="fw-bold">{item.userName.split(' ')[0]}</span>
                    </div>
                  </td>
                  <td className="small">{item.topic}</td>
                  <td className="small">
                    <div className="d-flex flex-column align-items-center">
                      <span style={{ fontSize: '0.7rem', color: '#6c757d' }}>
                        {item.period === 'AM' ? '上午' : '下午'}
                      </span>
                      <span className="fw-bold">{item.time}</span>
                    </div>
                  </td>
                  <td>
                    {item.platforms.youtube && <i className="bi bi-youtube text-danger fs-5 mx-1"></i>}
                    {item.platforms.twitch && <i className="bi bi-twitch text-primary fs-5 mx-1"></i>}
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline-danger border-0" 
                      onClick={() => handleDelete(item.id)}
                    >
                      <i className="bi bi-trash3-fill"></i>
                    </button>
                  </td>
                </tr>
              ))
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