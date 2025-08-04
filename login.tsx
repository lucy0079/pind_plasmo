import React, { useState } from 'react';
import './login.css';

interface LoginProps {
  url: string;              // 지도를 띄울 URL
  onClose: () => void;      // 로그인 모달 닫기
  onLoginSuccess: () => void; // 부모에게 로그인 성공 알림
}

const Login: React.FC<LoginProps> = ({ url, onClose, onLoginSuccess }) => {
  /* ───────── 상태 ───────── */
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [error, setError]               = useState('');
  const [mode, setMode]                 = useState<'login' | 'signup' | 'forgot-password'>('login');
  const [loading, setLoading]           = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  /* ───────── 공통 유틸 ───────── */
  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setLoading(false);
  };

  /* ───────── 로그인 ───────── */
  const handleLogin = async () => {
    setError('');
    if (!isValidEmail(email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username: email, password }).toString(),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.access_token) {
          // 크롬 스토리지에 JWT 보관
          await chrome.storage.local.set({
            jwtToken: data.access_token,
            tokenType: data.token_type,
          });
          onLoginSuccess();
        } else {
          setError('로그인 성공했지만 토큰을 받지 못했습니다.');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || '이메일 또는 비밀번호가 올바르지 않습니다.');
        setEmail('');
        setPassword('');
        setMode('login');
        
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('로그인 중 오류가 발생했습니다. 서버가 실행 중인지 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  /* ───────── 회원가입 ───────── */
  const handleSignup = async () => {
    setError('');
    if (!isValidEmail(email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }
    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setMode('login');
        clearForm();
        setError('회원가입 성공! 이제 로그인 해주세요.');
      } else {
        const errorData = await response.json();
        setError(errorData.message || '회원가입 중 오류가 발생했습니다.');
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다. 서버가 실행 중인지 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  /* ───────── 비밀번호 찾기 ───────── */
  const handleForgotPassword = async () => {
    setError('');
    if (!isValidEmail(email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setError('비밀번호 재설정 링크가 이메일로 전송되었습니다. 확인 후 다시 로그인해주세요.');
        setMode('login');
      } else {
        const data = await response.json();
        setError(data.message || '요청 처리 중 오류가 발생했습니다.');
      }
    } catch (err) {
      setError('오류가 발생했습니다. 서버가 실행 중인지 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  /* ───────── 렌더 ───────── */
  return (
    <div className="login-modal-overlay">
      <div className="login-modal-content">
        {/* 제목 */}
        <h2>
          {mode === 'login'
            ? '로그인'
            : mode === 'signup'
            ? '회원가입'
            : '비밀번호 찾기'}
        </h2>

        {/* 에러 메시지 */}
        {error && <p className="error-message">{error}</p>}

        {/* 비로그인 사용 시 확인 모달 */}
        {showConfirmation && (
          <div className="confirmation-overlay">
            <div className="confirmation-box">
              <p>이용에 제한이 있을 수 있습니다.</p>
              <div className="confirmation-buttons">
                <button
                  onClick={async () => {
                    await chrome.storage.session.set({ hasSkippedLogin: true });
                    // 즉시 지도 요청
                    chrome.runtime.sendMessage({
                      type: 'showMap',
                      url,
                      jwtToken: null,
                      tokenType: null,
                    });
                    onClose();
                  }}
                >
                  확인
                </button>
                <button onClick={() => setShowConfirmation(false)}>취소</button>
              </div>
            </div>
          </div>
        )}

        {/* 입력 폼 */}
        <div className="input-group">
          <div>
            <label>이메일:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder={mode === 'forgot-password' ? '가입한 이메일을 입력하세요' : ''}
            />
          </div>
          {mode !== 'forgot-password' && (
            <div>
              <label>비밀번호:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          )}
        </div>

        {/* 액션 버튼들 */}
        <div className="login-actions">
          {mode === 'login' ? (
            <>
              <button
                onClick={() => {
                  setMode('signup');
                  clearForm();
                }}
                disabled={loading}
                className="modal-action-btn"
              >
                회원가입
              </button>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="modal-action-btn"
              >
                {loading ? '로그인 중...' : '로그인'}
              </button>
            </>
          ) : mode === 'signup' ? (
            <>
              <button
                onClick={() => {
                  setMode('login');
                  clearForm();
                }}
                disabled={loading}
                className="modal-action-btn"
              >
                로그인 화면으로
              </button>
              <button
                onClick={handleSignup}
                disabled={loading}
                className="modal-action-btn"
              >
                {loading ? '가입 처리 중...' : '회원가입'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setMode('login');
                  clearForm();
                }}
                disabled={loading}
                className="modal-action-btn"
              >
                로그인 화면으로
              </button>
              <button
                onClick={handleForgotPassword}
                disabled={loading}
                className="modal-action-btn"
              >
                {loading ? '전송 중...' : '재설정 링크 받기'}
              </button>
            </>
          )}
        </div>

        {/* 하단 링크 모음 (로그인 화면 전용) */}
        {mode === 'login' && (
          <div className="bottom-links-group">
            <button
              onClick={() => setShowConfirmation(true)}
              disabled={loading}
              className="proceed-without-login-button"
            >
              로그인 없이 이용
            </button>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setMode('forgot-password');
                clearForm();
              }}
            >
              비밀번호를 잊으셨나요?
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
