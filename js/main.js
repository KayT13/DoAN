// Tab switching 
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
  });
});

// Enter chuyển ô tiếp theo
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    const activeEl = document.activeElement; 
    if (activeEl.tagName === 'INPUT' && activeEl.type !== 'checkbox') {
      e.preventDefault(); 
      const activePanel = document.querySelector('.tab-panel.active');
      const inputs = Array.from(activePanel.querySelectorAll('input:not([type="checkbox"])'));
      const currentIndex = inputs.indexOf(activeEl);
      if (currentIndex > -1 && currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1].focus();
      } else if (currentIndex === inputs.length - 1) {
        activePanel.querySelector('.btn-submit').focus();
      }
    }
  }
});

// Toggle password 
window.togglePw = function(id, btn) {
  const input = document.getElementById(id);
  const isText = input.type === 'text';
  input.type = isText ? 'password' : 'text';
  btn.innerHTML = isText
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
}

// Password strength
const ePwInput = document.getElementById('e-pw');
if (ePwInput) ePwInput.addEventListener('input', function() { updateStrength(this.value, 'email'); });

const pPwInput = document.getElementById('p-pw');
if (pPwInput) pPwInput.addEventListener('input', function() { updateStrength(this.value, 'phone'); });

function updateStrength(pw, mode) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const segs = mode === 'email' ? ['seg1','seg2','seg3','seg4'] : ['seg5','seg6','seg7','seg8'];
  const labels = ['','Yếu','Trung bình','Mạnh','Rất mạnh'];
  const cls = ['','weak','medium','strong','strong'];
  const colors = ['','#c87a7a','#d4a373','#829a7c','#829a7c'];

  segs.forEach((id, i) => {
    const el = document.getElementById(id);
    if(el) {
      el.className = 'strength-seg';
      if (i < score) el.classList.add(cls[score]);
    }
  });

  const lbl = document.getElementById(mode === 'email' ? 'strength-label' : 'strength-label-p');
  if(lbl) {
    lbl.textContent = pw.length ? labels[score] : '';
    lbl.style.color = colors[score];
  }
}

// Xử lý Lỗi
function showErr(id, msg) {
  const el = document.getElementById(id);
  if(!el) return;
  el.querySelector('span').textContent = msg;
  el.classList.add('visible');
  el.previousElementSibling.querySelector('input, .phone-row')?.classList?.add('error');
}

function clearErr(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('visible');
  el.previousElementSibling.querySelector('input, .phone-row')?.classList?.remove('error');
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^(0|84)(3|5|7|8|9)[0-9]{8}$/;

function checkField(id) {
  const el = document.getElementById(id);
  if (!el) return true;
  const val = el.value.trim();
  clearErr('err-' + id);
  let isValid = true;

  switch(id) {
    case 'e-name':
    case 'p-name':
      if (!val) { showErr('err-' + id, 'Vui lòng nhập họ và tên.'); isValid = false; }
      break;
    case 'e-email':
      if (!val) { 
        showErr('err-e-email', 'Vui lòng nhập email.'); isValid = false; 
      } else if (!emailRegex.test(val)) { 
        showErr('err-e-email', 'Định dạng email không hợp lệ (VD: ten@gmail.com).'); isValid = false; 
      }
      break;
    case 'p-phone':
      const cleanPhone = val.replace(/\s+/g, '');
      if (!cleanPhone) { showErr('err-p-phone', 'Vui lòng nhập số điện thoại.'); isValid = false; }
      else if (!phoneRegex.test(cleanPhone)) { showErr('err-p-phone', 'SĐT không hợp lệ (Phải là SĐT Việt Nam 10 số).'); isValid = false; }
      break;
    case 'e-pw':
    case 'p-pw':
      const pw = el.value; 
      if (!pw) { showErr('err-' + id, 'Vui lòng nhập mật khẩu.'); isValid = false; }
      else if (pw.length < 8) { showErr('err-' + id, 'Mật khẩu phải từ 8 ký tự trở lên.'); isValid = false; }
      const pw2Id = id === 'e-pw' ? 'e-pw2' : 'p-pw2';
      const pw2Input = document.getElementById(pw2Id);
      if (pw2Input && pw2Input.value) checkField(pw2Id);
      break;
    case 'e-pw2':
    case 'p-pw2':
      const pw2 = el.value;
      const mainPwId = id === 'e-pw2' ? 'e-pw' : 'p-pw';
      const mainPwInput = document.getElementById(mainPwId);
      const mainPw = mainPwInput ? mainPwInput.value : '';
      if (!pw2) { showErr('err-' + id, 'Vui lòng xác nhận lại mật khẩu.'); isValid = false; }
      else if (pw2 !== mainPw) { showErr('err-' + id, 'Mật khẩu xác nhận chưa khớp.'); isValid = false; }
      break;
  }
  return isValid;
}

['e-name','e-email','e-pw','e-pw2','p-name','p-phone','p-pw','p-pw2'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', () => clearErr('err-' + id));
    el.addEventListener('blur', () => checkField(id));
  }
});

function validateEmail() {
  const isNameValid = checkField('e-name');
  const isEmailValid = checkField('e-email');
  const isPwValid = checkField('e-pw');
  const isPw2Valid = checkField('e-pw2');
  const termsInput = document.getElementById('e-terms');
  const terms = termsInput ? termsInput.checked : false;
  if (!terms) { alert('Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.'); return false; }
  return isNameValid && isEmailValid && isPwValid && isPw2Valid;
}

window.submitEmail = function() {
  if (!validateEmail()) return;
  const btn = document.getElementById('btn-email');
  if (btn) btn.classList.add('loading');
  setTimeout(() => showSuccess('email'), 1500); 
}

function validatePhone() {
  const isNameValid = checkField('p-name');
  const isPhoneValid = checkField('p-phone');
  const isPwValid = checkField('p-pw');
  const isPw2Valid = checkField('p-pw2');
  const termsInput = document.getElementById('p-terms');
  const terms = termsInput ? termsInput.checked : false;
  if (!terms) { alert('Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.'); return false; }
  return isNameValid && isPhoneValid && isPwValid && isPw2Valid;
}

window.submitPhone = function() {
  if (!validatePhone()) return;
  const btn = document.getElementById('btn-phone');
  if (btn) btn.classList.add('loading');
  setTimeout(() => showSuccess('phone'), 1500); 
}

function showSuccess(mode) {
  const formRow = document.getElementById('main-form');
  if (formRow) formRow.style.display = 'none';
  
  const tabs = document.querySelector('.tabs');
  if (tabs) tabs.style.display = 'none';
  
  const header = document.querySelector('.form-inner-wrapper .card-header');
  if (header) header.style.display = 'none';
  
  const s = document.getElementById('success-screen');
  if (s) s.classList.add('show');
  
  const msgEl = document.getElementById('success-msg');
  if (msgEl) {
    msgEl.textContent = mode === 'email'
      ? 'Vui lòng kiểm tra hộp thư email của bạn để xác nhận tài khoản.'
      : 'Mã OTP xác nhận đã được gửi tới số điện thoại của bạn qua SMS.';
  }
}