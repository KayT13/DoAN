import { useState, useEffect } from 'react'
import './App.css'

// ─── ICONS ────────────────────────────────────────────────────────────────────
const BookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
  </svg>
)
const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
)
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
)
const EyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

// ─── FLOATING INPUT ───────────────────────────────────────────────────────────
function FloatingInput({ id, label, type = 'text', value, onChange, autoComplete }) {
  const [show, setShow] = useState(false)
  const isPwd = type === 'password'
  return (
    <div className={`floating-group ${value ? 'has-value' : ''}`}>
      <input
        id={id} className="floating-input"
        type={isPwd ? (show ? 'text' : 'password') : type}
        value={value} onChange={onChange}
        placeholder=" " autoComplete={autoComplete} required
      />
      <label className="floating-label" htmlFor={id}>{label}</label>
      {isPwd && (
        <button type="button" className="pwd-toggle" onClick={() => setShow(v => !v)} tabIndex={-1}>
          {show ? <EyeOff /> : <EyeOpen />}
        </button>
      )}
    </div>
  )
}

const Spinner = () => <span className="spinner" aria-hidden="true" />

// ─── DATA ─────────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: '🔤', title: 'Hangul cơ bản', desc: 'Học bảng chữ cái Hangul từ đầu, phát âm chuẩn xác theo giọng bản ngữ.' },
  { icon: '🎧', title: 'Luyện nghe', desc: 'Hàng trăm bài nghe từ sơ cấp đến cao cấp với phụ đề song ngữ.' },
  { icon: '✍️', title: 'Luyện viết', desc: 'Bài tập viết tay Hangul và ngữ pháp có chấm điểm tự động.' },
  { icon: '💬', title: 'Hội thoại', desc: 'Tình huống giao tiếp thực tế: mua sắm, nhà hàng, du lịch Hàn Quốc.' },
  { icon: '📖', title: 'Từ vựng theo chủ đề', desc: 'Flashcard thông minh với hệ thống ôn tập theo thuật toán spaced repetition.' },
  { icon: '🏆', title: 'Luyện thi TOPIK', desc: 'Đề thi thử TOPIK I & II với đáp án chi tiết và phân tích điểm yếu.' },
]

const LEVELS = [
  { label: 'Sơ cấp', ko: '초급', color: 'green', desc: 'Hangul, chào hỏi, số đếm', lessons: 24 },
  { label: 'Trung cấp', ko: '중급', color: 'orange', desc: 'Ngữ pháp, hội thoại hàng ngày', lessons: 36 },
  { label: 'Cao cấp', ko: '고급', color: 'red', desc: 'Văn phong trang trọng, TOPIK', lessons: 48 },
]

const TESTIMONIALS = [
  { name: 'Nguyễn Minh Anh', avatar: 'MA', text: 'Sau 3 tháng học, mình đã đọc được Hangul và giao tiếp cơ bản. Giao diện rất dễ dùng!', stars: 5 },
  { name: 'Trần Thị Hoa', avatar: 'TH', text: 'Phần luyện nghe rất hay, giọng đọc tự nhiên. Mình đã pass TOPIK I nhờ trang này.', stars: 5 },
  { name: 'Lê Văn Đức', avatar: 'LĐ', text: 'Flashcard từ vựng rất tiện, học trên điện thoại lúc rảnh. Tiến bộ rõ rệt sau 2 tháng.', stars: 4 },
]

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [courses, setCourses] = useState([])
  const [coursesLoading, setCoursesLoading] = useState(true)
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regUser, setRegUser] = useState('')
  const [regPwd, setRegPwd] = useState('')

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/courses')
      .then(r => r.json())
      .then(d => { if (d.status === 'success') setCourses(d.data) })
      .catch(() => {})
      .finally(() => setCoursesLoading(false))
    const saved = localStorage.getItem('user')
    if (saved) try { setLoggedInUser(JSON.parse(saved)) } catch {}
  }, [])

  const showMsg = (text, type = 'error') => setMessage({ text, type })

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!username || !password) return showMsg('Vui lòng điền đầy đủ thông tin.')
    setIsLoading(true)
    try {
      const res = await fetch('http://127.0.0.1:8000/api/users/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenDangNhap: username, matKhau: password }),
      })
      const data = await res.json()
      if (data.status === 'success') {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.data))
        setLoggedInUser(data.data)
        setAuthOpen(false)
        setMessage({ text: '', type: '' })
      } else showMsg(data.message || 'Sai tên đăng nhập hoặc mật khẩu.')
    } catch { showMsg('Không thể kết nối tới máy chủ!') }
    finally { setIsLoading(false) }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!regName || !regEmail || !regUser || !regPwd) return showMsg('Vui lòng điền đầy đủ thông tin.')
    if (regPwd.length < 8) return showMsg('Mật khẩu phải có ít nhất 8 ký tự.')
    setIsLoading(true)
    try {
      const res = await fetch('http://127.0.0.1:8000/api/users/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenDangNhap: regUser, matKhau: regPwd, hoTen: regName, email: regEmail }),
      })
      const data = await res.json()
      if (res.ok && data.status !== 'error') {
        showMsg('Đăng ký thành công!', 'success')
        setTimeout(() => { setIsLoginMode(true); setMessage({ text: '', type: '' }) }, 1200)
      } else showMsg('Tên đăng nhập đã tồn tại hoặc dữ liệu không hợp lệ.')
    } catch { showMsg('Không thể kết nối tới máy chủ!') }
    finally { setIsLoading(false) }
  }

  const handleLogout = () => {
    setLoggedInUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const getInitials = name => name ? name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() : '?'

  const getLevelColor = level => {
    if (!level) return 'badge-default'
    const l = level.toLowerCase()
    if (l.includes('cơ bản') || l.includes('beginner') || l.includes('sơ')) return 'badge-green'
    if (l.includes('trung') || l.includes('intermediate')) return 'badge-orange'
    if (l.includes('nâng') || l.includes('advanced') || l.includes('cao')) return 'badge-red'
    return 'badge-default'
  }

  return (
    <div className="app">

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="nav-inner">
          <a href="#" className="nav-logo">
            <span className="logo-ko">한국어</span>
            <span className="logo-text">HanQuoc<span className="logo-accent">Learn</span></span>
          </a>
          <div className="nav-links">
            <a href="#features" className="nav-link">Tính năng</a>
            <a href="#courses" className="nav-link">Khóa học</a>
            <a href="#levels" className="nav-link">Cấp độ</a>
          </div>
          <div className="nav-actions">
            {loggedInUser ? (
              <div className="nav-user">
                <div className="nav-avatar">{getInitials(loggedInUser.hoTen || loggedInUser.tenDangNhap)}</div>
                <span className="nav-username">{loggedInUser.hoTen || loggedInUser.tenDangNhap}</span>
                <button className="btn-nav-logout" onClick={handleLogout}>Đăng xuất</button>
              </div>
            ) : (
              <>
                <button className="btn-nav-ghost" onClick={() => { setIsLoginMode(true); setAuthOpen(true) }}>Đăng nhập</button>
                <button className="btn-nav-primary" onClick={() => { setIsLoginMode(false); setAuthOpen(true) }}>Bắt đầu miễn phí</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-tag">🇰🇷 Nền tảng học tiếng Hàn #1 Việt Nam</div>
        <h1 className="hero-title">
          Học tiếng Hàn<br />
          <span className="hero-highlight">tự nhiên & hiệu quả</span>
        </h1>
        <p className="hero-sub">
          Từ Hangul cơ bản đến TOPIK cao cấp — lộ trình rõ ràng, bài học sinh động,<br />
          luyện tập mỗi ngày chỉ 15 phút.
        </p>
        <div className="hero-cta">
          <button className="btn-hero-primary" onClick={() => { setIsLoginMode(false); setAuthOpen(true) }}>
            <PlayIcon /> Học ngay miễn phí
          </button>
          <button className="btn-hero-ghost" onClick={() => document.getElementById('courses').scrollIntoView({ behavior: 'smooth' })}>
            Xem khóa học
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat"><span className="stat-num">12,000+</span><span className="stat-label">Học viên</span></div>
          <div className="stat-divider" />
          <div className="stat"><span className="stat-num">150+</span><span className="stat-label">Bài học</span></div>
          <div className="stat-divider" />
          <div className="stat"><span className="stat-num">4.9 ⭐</span><span className="stat-label">Đánh giá</span></div>
        </div>
        <div className="hero-hangul" aria-hidden="true">
          {['가', '나', '다', '라', '마', '바', '사', '아', '자', '차', '카', '타', '파', '하'].map((c, i) => (
            <span key={i} className="hangul-char" style={{ animationDelay: `${i * 0.18}s` }}>{c}</span>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section" id="features">
        <div className="section-label">Tính năng</div>
        <h2 className="section-title">Mọi thứ bạn cần để học tiếng Hàn</h2>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── LEVELS ── */}
      <section className="section" id="levels">
        <div className="section-label">Cấp độ</div>
        <h2 className="section-title">Phù hợp với mọi trình độ</h2>
        <div className="levels-grid">
          {LEVELS.map((lv, i) => (
            <div className={`level-card level-${lv.color}`} key={i}>
              <div className="level-ko">{lv.ko}</div>
              <div className="level-label">{lv.label}</div>
              <p className="level-desc">{lv.desc}</p>
              <div className="level-lessons"><BookIcon /> {lv.lessons} bài học</div>
              <button className="btn-level">Bắt đầu</button>
            </div>
          ))}
        </div>
      </section>

      {/* ── COURSES ── */}
      <section className="section" id="courses">
        <div className="section-label">Khóa học</div>
        <div className="courses-header">
          <h2 className="section-title">Khóa học nổi bật</h2>
          {!coursesLoading && <span className="courses-count">{courses.length} khóa học</span>}
        </div>
        <div className="courses-grid">
          {coursesLoading
            ? [1, 2, 3].map(n => <div key={n} className="skeleton-card" />)
            : courses.length === 0
              ? (
                <div className="courses-empty">
                  <span className="empty-icon">📚</span>
                  <p>Chưa có khóa học nào. Hãy quay lại sau!</p>
                </div>
              )
              : courses.map((c, i) => (
                <div className="course-card" key={c.maKhoaHoc} style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="course-thumb">
                    <span className="course-thumb-ko">{['한', '어', '국', '말'][i % 4]}</span>
                  </div>
                  <div className="course-body">
                    <div className="course-top">
                      <span className={`level-badge ${getLevelColor(c.trinhDo)}`}>{c.trinhDo}</span>
                    </div>
                    <h3 className="course-name">{c.tenKhoaHoc}</h3>
                    <p className="course-desc">{c.moTa}</p>
                    <div className="course-meta">
                      <span className="meta-item"><ClockIcon /> {c.thoiLuong || '8 tuần'}</span>
                      <span className="meta-item"><UserIcon /> {c.soHocVien || '0'} học viên</span>
                    </div>
                    <button className="btn-enroll">Đăng ký học</button>
                  </div>
                </div>
              ))
          }
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section">
        <div className="section-label">Đánh giá</div>
        <h2 className="section-title">Học viên nói gì về chúng tôi</h2>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <div className="testimonial-card" key={i}>
              <div className="testimonial-stars">
                {Array.from({ length: t.stars }).map((_, j) => <StarIcon key={j} />)}
              </div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.avatar}</div>
                <span className="testimonial-name">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner">
        <div className="cta-ko" aria-hidden="true">시작하세요</div>
        <h2 className="cta-title">Bắt đầu hành trình tiếng Hàn hôm nay</h2>
        <p className="cta-sub">Miễn phí hoàn toàn. Không cần thẻ tín dụng.</p>
        <div className="cta-checks">
          {['Học mọi lúc, mọi nơi', 'Lộ trình cá nhân hóa', 'Cộng đồng hỗ trợ 24/7'].map((item, i) => (
            <span key={i} className="cta-check"><CheckIcon />{item}</span>
          ))}
        </div>
        <button className="btn-cta" onClick={() => { setIsLoginMode(false); setAuthOpen(true) }}>
          Tạo tài khoản miễn phí
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-logo">
          <span className="logo-ko">한국어</span>
          <span className="logo-text">HanQuoc<span className="logo-accent">Learn</span></span>
        </div>
        <p className="footer-copy">© 2025 HanQuocLearn. Học tiếng Hàn mỗi ngày.</p>
      </footer>

      {/* ── AUTH MODAL ── */}
      {authOpen && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setAuthOpen(false)}>
          <div className="modal">
            <button className="modal-close" onClick={() => setAuthOpen(false)} aria-label="Đóng">✕</button>

            <div className="auth-tabs">
              <div className="tab-slider" style={{ transform: isLoginMode ? 'translateX(4px)' : 'translateX(calc(100% + 0px))' }} />
              <button className={`tab-btn ${isLoginMode ? 'active' : ''}`} onClick={() => { setIsLoginMode(true); setMessage({ text: '', type: '' }) }}>Đăng nhập</button>
              <button className={`tab-btn ${!isLoginMode ? 'active' : ''}`} onClick={() => { setIsLoginMode(false); setMessage({ text: '', type: '' }) }}>Tạo tài khoản</button>
            </div>

            <div className="auth-body">
              {isLoginMode ? (
                <form onSubmit={handleLogin} noValidate>
                  <p className="auth-form-title">Chào mừng trở lại 👋</p>
                  <p className="auth-form-sub">Đăng nhập để tiếp tục học tiếng Hàn</p>
                  <div className="form-group">
                    <FloatingInput id="l-user" label="Tên đăng nhập" value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" />
                  </div>
                  <div className="form-group">
                    <FloatingInput id="l-pwd" label="Mật khẩu" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
                  </div>
                  <button className={`btn-primary ${isLoading ? 'is-loading' : ''}`} type="submit" disabled={isLoading}>
                    {isLoading ? <><Spinner /> Đang xử lý…</> : 'Đăng nhập'}
                  </button>
                  <p className="auth-switch-hint">Chưa có tài khoản? <button type="button" className="link-btn" onClick={() => setIsLoginMode(false)}>Đăng ký ngay</button></p>
                </form>
              ) : (
                <form onSubmit={handleRegister} noValidate>
                  <p className="auth-form-title">Tạo tài khoản mới 🎉</p>
                  <p className="auth-form-sub">Bắt đầu học tiếng Hàn miễn phí ngay hôm nay</p>
                  <div className="form-row">
                    <div className="form-group"><FloatingInput id="r-name" label="Họ và tên" value={regName} onChange={e => setRegName(e.target.value)} autoComplete="name" /></div>
                    <div className="form-group"><FloatingInput id="r-email" label="Email" type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} autoComplete="email" /></div>
                  </div>
                  <div className="form-group"><FloatingInput id="r-user" label="Tên đăng nhập" value={regUser} onChange={e => setRegUser(e.target.value)} autoComplete="username" /></div>
                  <div className="form-group"><FloatingInput id="r-pwd" label="Mật khẩu (ít nhất 8 ký tự)" type="password" value={regPwd} onChange={e => setRegPwd(e.target.value)} autoComplete="new-password" /></div>
                  <button className={`btn-primary btn-green ${isLoading ? 'is-loading' : ''}`} type="submit" disabled={isLoading}>
                    {isLoading ? <><Spinner /> Đang xử lý…</> : 'Tạo tài khoản'}
                  </button>
                  <p className="auth-switch-hint">Đã có tài khoản? <button type="button" className="link-btn" onClick={() => setIsLoginMode(true)}>Đăng nhập</button></p>
                </form>
              )}
              {message.text && (
                <div className={`message-box ${message.type === 'success' ? 'message-success' : 'message-error'}`}>
                  {message.text}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
