import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';

function Login({ onLogin }) {
  // 狀態管理
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [group, setGroup] = useState('meridian'); // 下拉選單預設值
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const auth = getAuth();

    try {
      // 1. 執行 Firebase 官方登入驗證
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // 將 Email 轉為小寫以便比對
      const emailStr = user.email.toLowerCase();
      
      // 2. 自動權限驗證邏輯
      let isAuthorized = false;

      // 檢查邏輯：所選團隊必須與 Email 中的關鍵字匹配
      if (group === 'meridian' && emailStr.includes('meridian')) {
        isAuthorized = true;
      } else if (group === 'springfish' && emailStr.includes('springfish')) {
        isAuthorized = true;
      }

      // 3. 攔截無權限的帳號
      if (!isAuthorized) {
        alert(`⚠️ 權限錯誤：\n您的帳號「${emailStr}」無權管理「${group === 'meridian' ? 'MERIDIAN project' : '春魚 Spring Fish'}」！`);
        
        // 關鍵：必須登出 Firebase，否則該帳號的 Token 仍會留在瀏覽器中
        await signOut(auth); 
        setLoading(false);
        return;
      }

      // 4. 驗證成功，回傳資訊給 App.jsx
      onLogin({
        uid: user.uid,
        email: user.email,
        group: group // 這是從下拉選單抓到的：'meridian' 或 'springfish'
      });
      
    } catch (error) {
      console.error("登入錯誤:", error.code);
      // 根據錯誤碼給予提示
      if (error.code === 'auth/invalid-credential') {
        alert('帳號或密碼錯誤！');
      } else if (error.code === 'auth/user-not-found') {
        alert('找不到此使用者！');
      } else if (error.code === 'auth/too-many-requests') {
        alert('嘗試次數過多，請稍後再試。');
      } else {
        alert('登入失敗，請稍後再試。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow border-0 p-4" style={{ width: '100%', maxWidth: '400px', borderRadius: '15px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold" style={{ color: '#D8BFD8' }}>團隊排班系統</h2>
          <p className="text-muted small">請輸入管理員帳號密碼</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 團體選擇 */}
          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">管理團隊</label>
            <select 
              className="form-select border-2" 
              value={group} 
              onChange={(e) => setGroup(e.target.value)}
              style={{ borderColor: '#f3e5f5' }}
            >
              <option value="meridian">MERIDIAN project</option>
              <option value="springfish">春魚 Spring Fish</option>
            </select>
          </div>

          {/* Email 輸入 */}
          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">電子信箱</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          {/* 密碼輸入 */}
          <div className="mb-4">
            <label className="form-label small fw-bold text-secondary">授權密碼</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="請輸入密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          {/* 登入按鈕 */}
          <button 
            type="submit" 
            className="btn text-white w-100 fw-bold py-2 shadow-sm" 
            style={{ backgroundColor: '#D8BFD8', border: 'none' }}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : '確認登入'}
          </button>
        </form>

        {/* 底部說明區塊 */}
        <div className="mt-4 pt-3 border-top">
          <div className="alert alert-secondary py-2 px-3 mb-0" style={{ fontSize: '0.75rem', backgroundColor: '#f8f9fa', border: '1px dashed #dee2e6' }}>
            <p className="mb-1 text-center fw-bold text-secondary">
              <i className="bi bi-info-circle me-1"></i> 專案展示說明
            </p>
            <ul className="mb-0 ps-3 text-muted">
              <li>本專案僅供個人作品集練習與技術展示使用。</li>
              <li>非正式營運之商業平台，相關數據均為測試資料。</li>
              <li>登入帳號需包含對應團隊關鍵字方可通過驗證。</li>
            </ul>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default Login;