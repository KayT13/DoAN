import { useState, useEffect, useRef } from 'react'
import './App.css'

// ─── PASSWORD STRENGTH ────────────────────────────────────────────────────────
function getPasswordStrength(pwd) {
  if (!pwd) return { score: 0, label: '', color: '' }
  let score = 0
  if (pwd.length >= 8) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++
  const levels = [
    { label: '', color: '' },
    { label: 'Yếu', color: 'strength-weak' },
    { label: 'Trung bình', color: 'strength-fair' },
    { label: 'Khá', color: 'strength-good' },
    { label: 'Mạnh', color: 'strength-strong' },
  ]
  return { score, ...levels[score] }
}

// ─── EYE ICONS ────────────────────────────────────────────────────────────────
const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

// ─── FLOATING LABEL INPUT ─────────────────────────────────────────────────────
function FloatingInput({ id, label, type = 'text', value, onChange, autoComplete }) {
  const [showPwd, setShowPwd] = useState(false)
  const isPwd = type === 'password'
  const inputType = isPwd ? (showPwd ? 'text' : 'password') : type

  return (
    <div className={`floating-group ${value ? 'has-value' : ''}`}>
      <input
        id={id}
        className="floating-input"
        type={inputType}
        value={value}
        onChange={onChange}
        placeholder=" "
        autoComplete={autoComplete}
        required
      />
      <label className="floating-label" htmlFor={id}>{label}</label>
      {isPwd && (
        <button
          type="button"
          className="pwd-toggle"
          onClick={() => setShowPwd(v => !v)}
          tabIndex={-1}
          aria-label={showPwd ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        >
          {showPwd ? <EyeOff /> : <EyeOpen />}
        </button>
      )}
    </div>
  )
}

// ─── SPINNER ICON ─────────────────────────────────────────────────────────────
const Spinner = () => <span className="spinner" aria-hidden="true" />

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
function App() {
  // Courses
  const [courses, setCourses] = useState([])
  const [coursesLoading, setCoursesLoading] = useState(true)

  // Auth
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('error')
  const [slideDir, setSlideDir] = useState('') // 'left' | 'right'

  // Login fields
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Register fields
  const [regFullName, setRegFullName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regUsername, setRegUsername] = useState('')
  const [regPassword, setRegPassword] = useState('')

  const pwdStrength = getPasswordStrength(regPassword)
  const panelRef = useRef(null)

  // ── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/courses')
      .then(r => r.json())
      .then(d => { if (d.status === 'success') setCourses(d.data) })
      .catch(e => console.error('Lỗi tải khóa học:', e))
      .finally(() => setCoursesLoading(false))

    const saved = localStorage.getItem('user')
    if (saved) { try { setLoggedInUser(JSON.parse(saved)) } catch { } }
  }, [])

  // ── Helpers ───────────────────────────────────────────────────────────────
  const getInitials = name => {
    if (!name) return '?'
    return name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  }

  const getLevelClass = level => {
    if (!level) return 'badge-default'
    const l = level.toLowerCase()
    if (l.includes('cơ bản') || l.includes('beginner')) return 'badge-green'
    if (l.includes('trung') || l.includes('intermediate')) return 'badge-orange'
    if (l.includes('nâng') || l.includes('advanced')) return 'badge-red'
    return 'badge-default'
  }

  const COURSE_ICONS = ['📚', '💻', '🎨', '🔬', '🎵', '🌏', '📊', '🏗️', '🧠', '🚀']
  const ICON_COLORS = ['icon-blue', 'icon-purple', 'icon-orange', 'icon-green', 'icon-teal', 'icon-red', 'icon-blue', 'icon-orange', 'icon-purple', 'icon-teal']

  const showMsg = (text, type = 'error') => {
    setMessage('')
    requestAnimationFrame(() => { setMessage(text); setMessageType(type) })
  }

  // ── Tab switch with slide animation ───────────────────────────────────────
  const switchMode = (toLogin) => {
    if (toLogin === isLoginMode) return
    setMessage('')
    setSlideDir(toLogin ? 'right' : 'left')

    const panel = panelRef.current
    if (panel) {
      panel.classList.add('panel-exit-' + (toLogin ? 'right' : 'left'))
      setTimeout(() => {
        setIsLoginMode(toLogin)
        panel.classList.remove('panel-exit-left', 'panel-exit-right')
        panel.classList.add('panel-enter-' + (toLogin ? 'right' : 'left'))
        setTimeout(() => panel.classList.remove('panel-enter-left', 'panel-enter-right'), 350)
      }, 180)
    } else {
      setIsLoginMode(toLogin)
    }
  }

  // ── Login ─────────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault()
    if (!username || !password) return showMsg('Vui lòng điền đầy đủ thông tin.')
    setIsLoading(true)
    try {
      const res = await fetch('http://127.0.0.1:8000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenDangNhap: username, matKhau: password }),
      })
      const data = await res.json()
      if (data.status === 'success') {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.data))
        setMessage('')
        setLoggedInUser(data.data)
      } else {
        showMsg(data.message || 'Sai tên đăng nhập hoặc mật khẩu.')
      }
    } catch {
      showMsg('Không thể kết nối tới máy chủ!')
    } finally {
      setIsLoading(false)
    }
  }

  // ── Register ──────────────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault()
    if (!regFullName || !regEmail || !regUsername || !regPassword)
      return showMsg('Vui lòng điền đầy đủ thông tin.')
    if (regPassword.length < 8)
      return showMsg('Mật khẩu phải có ít nhất 8 ký tự.')
    setIsLoading(true)
    try {
      const res = await fetch('http://127.0.0.1:8000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenDangNhap: regUsername, matKhau: regPassword, hoTen: regFullName, email: regEmail }),
      })
      const data = await res.json()
      if (res.ok && data.status !== 'error') {
        showMsg('Đăng ký thành công! Đang chuyển hướng…', 'success')
        setRegUsername(''); setRegPassword(''); setRegFullName(''); setRegEmail('')
        setTimeout(() => switchMode(true), 1500)
      } else {
        showMsg('Tên đăng nhập đã tồn tại hoặc dữ liệu không hợp lệ.')
      }
    } catch {
      showMsg('Không thể kết nối tới máy chủ!')
    } finally {
      setIsLoading(false)
    }
  }

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    setLoggedInUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="app">

      {/* HEADER */}
      <div className="header">
        <div className="header-badge">Nền tảng học trực tuyến</div>
        <h1 className="header-title">Khám phá kiến thức mới</h1>
        <p className="header-subtitle">Học mọi lúc, mọi nơi — theo cách của bạn</p>
      </div>

      {/* ── AUTH ── */}
      {loggedInUser === null ? (
        <div className="auth-card">

          {/* Sliding tab bar */}
          <div className="auth-tabs">
            <div
              className="tab-slider"
              style={{ transform: isLoginMode ? 'translateX(4px)' : 'translateX(calc(100% + 0px))' }}
            />
            <button
              className={`tab-btn ${isLoginMode ? 'active' : ''}`}
              onClick={() => switchMode(true)}
            >
              Đăng nhập
            </button>
            <button
              className={`tab-btn ${!isLoginMode ? 'active' : ''}`}
              onClick={() => switchMode(false)}
            >
              Tạo tài khoản
            </button>
          </div>

          {/* Form panel */}
          <div className="auth-body" ref={panelRef}>

            {isLoginMode ? (
              /* ── LOGIN FORM ── */
              <form onSubmit={handleLogin} noValidate>

                <div className="auth-form-header">
                  <div className="auth-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <p className="auth-form-title">Chào mừng trở lại</p>
                    <p className="auth-form-sub">Đăng nhập để tiếp tục học tập</p>
                  </div>
                </div>

                <div className="form-group">
                  <FloatingInput id="login-user" label="Tên đăng nhập" value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" />
                </div>
                <div className="form-group">
                  <FloatingInput id="login-pwd" label="Mật khẩu" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
                </div>

                <button className={`btn-primary ${isLoading ? 'is-loading' : ''}`} type="submit" disabled={isLoading}>
                  {isLoading ? <><Spinner /> Đang xử lý…</> : 'Đăng nhập'}
                </button>

                <p className="auth-switch-hint">
                  Chưa có tài khoản?{' '}
                  <button type="button" className="link-btn" onClick={() => switchMode(false)}>Đăng ký ngay</button>
                </p>
              </form>
            ) : (
              /* ── REGISTER FORM ── */
              <form onSubmit={handleRegister} noValidate>

                <div className="auth-form-header">
                  <div className="auth-icon auth-icon-green">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <line x1="19" y1="8" x2="19" y2="14" />
                      <line x1="22" y1="11" x2="16" y2="11" />
                    </svg>
                  </div>
                  <div>
                    <p className="auth-form-title">Tạo tài khoản mới</p>
                    <p className="auth-form-sub">Bắt đầu hành trình học tập của bạn</p>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <FloatingInput id="reg-name" label="Họ và tên" value={regFullName} onChange={e => setRegFullName(e.target.value)} autoComplete="name" />
                  </div>
                  <div className="form-group">
                    <FloatingInput id="reg-email" label="Email" type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} autoComplete="email" />
                  </div>
                </div>

                <div className="form-group">
                  <FloatingInput id="reg-user" label="Tên đăng nhập" value={regUsername} onChange={e => setRegUsername(e.target.value)} autoComplete="username" />
                </div>

                <div className="form-group">
                  <FloatingInput id="reg-pwd" label="Mật khẩu" type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} autoComplete="new-password" />

                  {regPassword && (
                    <div className="strength-meter">
                      <div className="strength-bars">
                        {[1, 2, 3, 4].map(n => (
                          <div key={n} className={`strength-bar ${pwdStrength.score >= n ? pwdStrength.color : ''}`} />
                        ))}
                      </div>
                      <span className={`strength-label ${pwdStrength.color}`}>{pwdStrength.label}</span>
                    </div>
                  )}
                </div>

                <button className={`btn-primary btn-green ${isLoading ? 'is-loading' : ''}`} type="submit" disabled={isLoading}>
                  {isLoading ? <><Spinner /> Đang xử lý…</> : 'Tạo tài khoản'}
                </button>

                <p className="auth-switch-hint">
                  Đã có tài khoản?{' '}
                  <button type="button" className="link-btn" onClick={() => switchMode(true)}>Đăng nhập</button>
                </p>
              </form>
            )}

            {/* Message toast */}
            {message && (
              <div className={`message-box ${messageType === 'success' ? 'message-success' : 'message-error'}`}>
                <span className="message-icon">
                  {messageType === 'success'
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                  }
                </span>
                {message}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── USER CARD ── */
        <div className="user-card">
          <div className="avatar">{getInitials(loggedInUser.hoTen || loggedInUser.tenDangNhap)}</div>
          <div className="user-info">
            <div className="user-name">{loggedInUser.hoTen}</div>
            <div className="user-email">{loggedInUser.email}</div>
            <div className="user-active-badge"><span className="active-dot" />Đang hoạt động</div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>Đăng xuất</button>
        </div>
      )}

      {/* ── COURSES ── */}
      <div className="section-header">
        <h2 className="section-title">Khóa học</h2>
        {!coursesLoading && <span className="section-count">{courses.length} khóa học</span>}
      </div>

      <div className="courses-grid">
        {coursesLoading
          ? [1, 2, 3].map(n => <div key={n} className="skeleton-card" />)
          : courses.length === 0
            ? <p className="empty-text">Không có khóa học nào.</p>
            : courses.map((course, i) => (
              <div className="course-card" key={course.maKhoaHoc} style={{ animationDelay: `${i * 55}ms` }}>
                <div className={`course-icon ${ICON_COLORS[i % ICON_COLORS.length]}`}>
                  {COURSE_ICONS[i % COURSE_ICONS.length]}
                </div>
                <div className="course-info">
                  <div className="course-name">{course.tenKhoaHoc}</div>
                  <div className="course-desc">{course.moTa}</div>
                  <div className="course-meta">
                    <span className={`level-badge ${getLevelClass(course.trinhDo)}`}>{course.trinhDo}</span>
                  </div>
                </div>
                <span className="course-arrow">›</span>
              </div>
            ))
        }
      </div>

    </div>
  )
}

export default App