import React, { useState } from 'react';
import './login.css';

interface LoginProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  const handleLogin = async () => {
    setError('');
    if (!isValidEmail(email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    setLoading(true); // 로딩 시작
    try {
      const response = await fetch('http://localhost:8001/auth/login', { // 실제 서버 주소로 변경해주세요.
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }).toString(),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.access_token) {
          await chrome.storage.local.set({
            'jwtToken': data.access_token,
            'tokenType': data.token_type
          });
          onLoginSuccess();
        } else {
          setError('로그인 성공했지만 토큰을 받지 못했습니다.');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || '이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('로그인 중 오류가 발생했습니다. 서버가 실행 중인지 확인해주세요.');
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

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

    setLoading(true); // 로딩 시작
    try {
      const response = await fetch('http://localhost:8001/auth/register', { // 실제 서버 주소로 변경해주세요.
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setMode('login');
        setEmail('');
        setPassword('');
        setError('회원가입 성공! 이제 로그인 해주세요.');
      } else {
        const errorData = await response.json();
        setError(errorData.message || '회원가입 중 오류가 발생했습니다.');
      }
    } catch (error) {
      setError('회원가입 중 오류가 발생했습니다. 서버가 실행 중인지 확인해주세요.');
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // 이메일 유효성 검사 함수
  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-content">
        <h2>{mode === 'login' ? '로그인' : '회원가입'}</h2>
        {error && <p className="error-message">{error}</p>}

        <div className="input-group">
          <div>
            <label>이메일:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label>비밀번호:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="button-group">
          {mode === 'login' ? (
            <>
              <button onClick={() => {
                setMode('signup');
                setEmail('');
                setPassword('');
                setError('');
              }} disabled={loading}>회원가입</button>
              <button onClick={handleLogin} disabled={loading}>
                {loading ? '로그인 중...' : '로그인'}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => {
                setMode('login');
                setEmail('');
                setPassword('');
                setError('');
              }} disabled={loading}>로그인 화면으로</button>
              <button onClick={handleSignup} disabled={loading}>
                {loading ? '가입 처리 중...' : '회원가입'}
              </button>
            </>
          )}
        </div>
        <button onClick={onClose} disabled={loading}>닫기</button>
      </div>
    </div>
  );
};

export default Login;