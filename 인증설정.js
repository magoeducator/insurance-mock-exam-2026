/* 2026 온라인학습실 - Apps Script 연결 클라이언트 */
(function (window, document) {
  'use strict';

  var API_URL = 'https://script.google.com/macros/s/AKfycbyuUAuhMC3K19B6nhzT4ikve2WIlGPkWkn8aTUbg0lu5wYq45jzYaFLVuS0LFLt0OWp/exec';
  var TOKEN_KEY = 'career_educator_learning_token';
  var STATE_KEY = 'career_educator_learning_state';
  function request(action, params) {
    var query = [];
    var values = params || {};
    var key;

    query.push('action=' + encodeURIComponent(action));
    for (key in values) {
      if (Object.prototype.hasOwnProperty.call(values, key) && values[key] !== undefined && values[key] !== null) {
        query.push(encodeURIComponent(key) + '=' + encodeURIComponent(values[key]));
      }
    }

    return fetch(API_URL + '?' + query.join('&'), {
      method: 'GET',
      mode: 'cors',
      cache: 'no-store'
    }).then(function (response) {
      if (!response.ok) throw new Error('로그인 서버가 응답하지 않습니다.');
      return response.json();
    }).catch(function (error) {
      if (error && error.message === 'Failed to fetch') {
        throw new Error('로그인 서버 연결이 차단되었습니다. 브라우저를 새로고침해 주세요.');
      }
      throw error;
    });
  }

  function getToken() {
    try { return window.localStorage.getItem(TOKEN_KEY) || ''; } catch (error) { return ''; }
  }

  function saveSession(payload) {
    try {
      window.localStorage.setItem(TOKEN_KEY, payload.token);
      window.localStorage.setItem(STATE_KEY, JSON.stringify({
        student: payload.student || null,
        setting: payload.setting || null
      }));
    } catch (error) {}
  }

  function clearSession() {
    try {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(STATE_KEY);
    } catch (error) {}
  }

  function savedState() {
    try { return JSON.parse(window.localStorage.getItem(STATE_KEY) || '{}'); } catch (error) { return {}; }
  }

  function renderPageDday(setting) {
    var row = document.querySelector('.site-title-row');
    if (!row || document.getElementById('authDdayBadge')) return;

    if (!document.getElementById('authDdayStyle')) {
      var style = document.createElement('style');
      style.id = 'authDdayStyle';
      style.textContent = [
        '.site-title-row{position:relative;padding-right:max(108px,calc((100% - 760px)/2 + 108px))!important}',
        '.site-title{padding-right:4px}',
        '.auth-dday-badge{position:absolute;top:6px;right:max(12px,calc((100% - 760px)/2 + 12px));display:inline-flex;align-items:center;gap:5px;min-width:78px;height:32px;padding:3px 8px;border:1px solid #84f3c5;border-radius:7px;background:#0b1724;color:#fef08a;box-shadow:0 0 8px rgba(110,231,183,.48),inset 0 0 8px rgba(110,231,183,.16);font-family:"Courier New",monospace;line-height:1;animation:authDdayGlow 2.4s ease-in-out infinite;z-index:2}',
        '.auth-dday-badge span{color:#8df3c1;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans KR",sans-serif;font-size:9px;font-weight:800;letter-spacing:-.04em}',
        '.auth-dday-badge strong{font-size:15px;letter-spacing:.02em;text-shadow:0 0 5px rgba(254,240,138,.85)}',
        '@keyframes authDdayGlow{0%,100%{filter:brightness(1);transform:translateY(0)}50%{filter:brightness(1.16);transform:translateY(-1px)}}',
        '@media(max-width:390px){.site-title-row{padding-right:92px!important}.auth-dday-badge{right:8px;min-width:67px;padding:3px 5px}.auth-dday-badge span{font-size:8px}.auth-dday-badge strong{font-size:12px}}',
        '@media(prefers-reduced-motion:reduce){.auth-dday-badge{animation:none}}'
      ].join('');
      document.head.appendChild(style);
    }

    var badge = document.createElement('span');
    badge.id = 'authDdayBadge';
    badge.className = 'auth-dday-badge';
    var label = document.createElement('span');
    label.textContent = '시험일까지';
    var value = document.createElement('strong');
    value.textContent = setting && setting.dDay ? setting.dDay : 'D-day';
    badge.appendChild(label);
    badge.appendChild(value);
    row.appendChild(badge);
  }

  function renderExamSocialLinks() {
    var topbar = document.querySelector('.topbar');
    if (!topbar || document.getElementById('authSocialLinks')) return;

    if (!document.getElementById('authSocialLinksStyle')) {
      var style = document.createElement('style');
      style.id = 'authSocialLinksStyle';
      style.textContent = '.auth-social-links{display:flex;align-items:center;gap:9px;margin-top:9px;font-size:11px;font-weight:800}.auth-social-links .auth-social-label{color:rgba(255,255,255,.92);white-space:nowrap}.auth-social-links a{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:8px;color:#fff;text-decoration:none}.auth-social-links svg{width:15px;height:15px;display:block}.auth-social-links .instagram{background:linear-gradient(135deg,#f58529,#dd2a7b 52%,#8134af)}.auth-social-links .blog{background:#03c75a}.auth-social-links a:hover,.auth-social-links a:focus-visible{filter:brightness(.92);transform:translateY(-1px)}@media(max-width:420px){.auth-social-links{gap:8px;font-size:10px}}';
      document.head.appendChild(style);
    }

    var links = document.createElement('div');
    links.id = 'authSocialLinks';
    links.className = 'auth-social-links';
    links.innerHTML = '<span class="auth-social-label">강의하는 심팀장</span><a class="instagram" href="https://www.instagram.com/career_educator" target="_blank" rel="noopener noreferrer" aria-label="인스타그램" title="인스타그램"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg></a><a class="blog" href="https://blog.naver.com/magoshim" target="_blank" rel="noopener noreferrer" aria-label="네이버 블로그" title="네이버 블로그"><svg viewBox="0 0 24 24" aria-hidden="true"><text x="12" y="17" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="900" fill="currentColor">B</text></svg></a>';
    topbar.appendChild(links);
  }

  function redirectToLogin() {
    var returnTo = window.location.pathname.split('/').pop() || '학습실.html';
    var base = /\/\d+형\//.test(window.location.pathname) ? '../' : './';
    window.location.replace(base + '로그인.html?return=' + encodeURIComponent(returnTo));
  }

  function requireStudent() {
    var token = getToken();
    if (!token) {
      redirectToLogin();
      return Promise.resolve(false);
    }
    return request('validate', { token: token }).then(function (payload) {
      if (!payload.ok) {
        clearSession();
        redirectToLogin();
        return false;
      }
      try {
        window.localStorage.setItem(STATE_KEY, JSON.stringify({
          student: payload.student || null,
          setting: payload.setting || null
        }));
      } catch (error) {}
      renderPageDday(payload.setting);
      renderExamSocialLinks();
      document.documentElement.classList.remove('auth-pending');
      return true;
    }).catch(function () {
      clearSession();
      redirectToLogin();
      return false;
    });
  }

  window.LearningAuth = {
    request: request,
    getToken: getToken,
    savedState: savedState,
    saveSession: saveSession,
    clearSession: clearSession,
    requireStudent: requireStudent,
    login: function (name, phone, code) {
      return request('login', { name: name, phone: phone, code: code }).then(function (payload) {
        if (payload.ok) saveSession(payload);
        return payload;
      });
    },
    adminLogin: function (password) {
      return request('adminLogin', { password: password });
    },
    adminData: function (token) {
      return request('adminData', { token: token });
    },
    saveSettings: function (token, data) {
      data = data || {};
      data.token = token;
      return request('saveSettings', data);
    },
    addStudent: function (token, data) {
      data = data || {};
      data.token = token;
      return request('addStudent', data);
    },
    setStatus: function (token, rowNumber, status) {
      return request('setStatus', { token: token, rowNumber: rowNumber, status: status });
    },
    logout: function () {
      clearSession();
      window.location.href = './로그인.html';
    }
  };
}(window, document));
