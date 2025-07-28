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

  const handleLogin = async () => {
    setError('');
    if (!isValidEmail(email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/login', { // 실제 서버 주소로 변경해주세요.
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        localStorage.setItem('isLoggedIn', 'true');
        onLoginSuccess();
      } else {
        const errorData = await response.json();
        setError(errorData.message || '이메일 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      setError('로그인 중 오류가 발생했습니다.');
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

    try {
      const response = await fetch('http://localhost:3000/signup', { // 실제 서버 주소로 변경해주세요.
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
      setError('회원가입 중 오류가 발생했습니다.');
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
        {error && <p>{error}</p>}

        <div className="input-group">
          <div>
            <label>이메일:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>비밀번호:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <div className="button-group">
          {mode === 'login' ? (
            <>
              <>
              <button onClick={() => {
                setMode('signup');
                setEmail(''); // 이메일 초기화
                setPassword(''); // 비밀번호 초기화
              }}>회원가입</button>
              <button onClick={handleLogin}>로그인</button>
            </>
            </>
          ) : (
            <>
              <>
              <button onClick={() => {
                setMode('login');
                setEmail(''); // 이메일 초기화
                setPassword(''); // 비밀번호 초기화
              }}>로그인 화면으로</button>
              <button onClick={handleSignup}>회원가입</button>
            </>
            </>
          )}
        </div>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default Login;
