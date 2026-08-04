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
