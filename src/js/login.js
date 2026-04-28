import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getAuth,
  getRedirectResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
  GithubAuthProvider
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const apiBase = (window.APP_CONFIG && window.APP_CONFIG.apiBase) || localStorage.getItem('apiBase') || 'http://localhost:4000';

const googleBtn = document.getElementById('google-btn');
const githubBtn = document.getElementById('github-btn');
const emailForm = document.getElementById('email-login-form');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const signinBtn = document.getElementById('signin-btn');
const authMessage = document.getElementById('auth-message');

let isSignupMode = false;
const toggleSignupBtn = document.getElementById('toggle-signup');
const formTitle = document.querySelector('.signin-title');
const formEyebrow = document.querySelector('.auth-eyebrow');

if (toggleSignupBtn) {
  toggleSignupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isSignupMode = !isSignupMode;
    if (isSignupMode) {
      formTitle.textContent = 'Sign up';
      formEyebrow.textContent = 'Be a friend';
      signinBtn.textContent = 'Sign up';
      signinBtn.dataset.originalText = 'Sign up';
      toggleSignupBtn.textContent = 'Already have an account? Sign in';
    } else {
      formTitle.textContent = 'Sign in';
      formEyebrow.textContent = 'Welcome back';
      signinBtn.textContent = 'Sign in';
      signinBtn.dataset.originalText = 'Sign in';
      toggleSignupBtn.textContent = 'Be a friend (Sign up if first time we meet)';
    }
    setMessage('');
  });
}

function setMessage(text, type) {
  if (!authMessage) return;
  authMessage.textContent = text || '';
  authMessage.className = `auth-message${type ? ` is-${type}` : ''}`;
}

function getDeviceId() {
  const existing = localStorage.getItem('deviceId');
  if (existing) return existing;

  const newId = typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `device_${Math.random().toString(36).slice(2, 10)}`;

  localStorage.setItem('deviceId', newId);
  return newId;
}

function getDeviceInfo() {
  const ua = navigator.userAgent || '';
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  return {
    userAgent: ua,
    platform: navigator.platform || '',
    language: navigator.language || '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    vendor: navigator.vendor || '',
    memory: navigator.deviceMemory || null,
    cores: navigator.hardwareConcurrency || null,
    mobile: /Mobi|Android/i.test(ua),
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      ratio: window.devicePixelRatio || 1
    },
    connection: connection
      ? {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        }
      : null,
    touchPoints: navigator.maxTouchPoints || 0
  };
}

function formatAuthError(error) {
  if (!error) return 'Sign in failed. Please try again.';
  
  if (!error.code) {
    // Surface network/backend errors directly
    return error.message || 'Sign in failed. Please try again.';
  }

  switch (error.code) {
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email or password is incorrect.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled in your Firebase console.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup closed. Try again.';
    default:
      // Surface raw firebase message if unhandled code
      return error.message || 'Sign in failed. Please try again.';
  }
}

function setLoading(button, isLoading, loadingText) {
  if (!button) return;
  const originalText = button.dataset.originalText || button.textContent;
  if (!button.dataset.originalText) button.dataset.originalText = originalText;
  button.disabled = isLoading;
  button.textContent = isLoading ? loadingText : button.dataset.originalText;
}

async function syncUser(token, user) {
  const deviceId = getDeviceId();
  const device = getDeviceInfo();

  const response = await fetch(`${apiBase}/api/user/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      displayName: user.displayName,
      avatar: user.photoURL,
      deviceId,
      device
    })
  });

  if (!response.ok) {
    throw new Error('Backend sync failed');
  }
}

async function handleLoginSuccess(result) {
  const token = await result.user.getIdToken();
  try {
    await syncUser(token, result.user);
  } catch (err) {
    console.warn('Backend sync unavailable, but Firebase login succeeded:', err);
  }
  localStorage.setItem('authToken', token);
  window.location.href = 'index.html';
}

const firebaseConfig = {
  apiKey: "AIzaSyBUD8LAcfq1C7Z4SMLJ5FcTdJRauOkgAMg",
  authDomain: "portfolio-01234.firebaseapp.com",
  projectId: "portfolio-01234",
  storageBucket: "portfolio-01234.firebasestorage.app",
  messagingSenderId: "222796924389",
  appId: "1:222796924389:web:ff64f964b662be7ac81b0c",
  measurementId: "G-1RM5G4SKSN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const providerGoogle = new GoogleAuthProvider();
const providerGithub = new GithubAuthProvider();

async function handleSocialLogin(provider) {
  setMessage('Redirecting to secure login...');
  
  try {
    sessionStorage.setItem('isRedirecting', 'true');
    await signInWithRedirect(auth, provider);
  } catch (error) {
    sessionStorage.removeItem('isRedirecting');
    console.error('Error signing in:', error);
    setMessage(formatAuthError(error), 'error');
  }
}

if (googleBtn) googleBtn.addEventListener('click', () => handleSocialLogin(providerGoogle));
if (githubBtn) githubBtn.addEventListener('click', () => handleSocialLogin(providerGithub));

if (emailForm) {
  emailForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';

    if (!email || !password) {
      setMessage('Enter both email and password.', 'error');
      return;
    }

    setLoading(signinBtn, true, isSignupMode ? 'Signing up...' : 'Signing in...');
    setMessage('');

    try {
      let result;
      if (isSignupMode) {
        result = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(result.user);
        setMessage('Verification link sent! Please check your email.', 'success');
        auth.signOut();
        return;
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
        if (!result.user.emailVerified) {
          setMessage('Please verify your email address to log in. Check your inbox.', 'error');
          auth.signOut();
          return;
        }
      }
      await handleLoginSuccess(result);
    } catch (error) {
      console.error('Email sign in failed:', error);
      setMessage(formatAuthError(error), 'error');
    } finally {
      setLoading(signinBtn, false);
    }
  });
}

if (auth) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const token = await user.getIdToken();
      localStorage.setItem('authToken', token);
      
      // Only auto-redirect if they just came back from a social login redirect
      if (sessionStorage.getItem('isRedirecting') === 'true') {
        sessionStorage.removeItem('isRedirecting');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 500);
      }
    }
  });

  getRedirectResult(auth)
    .then((result) => {
      if (result) {
        sessionStorage.removeItem('isRedirecting');
        return handleLoginSuccess(result);
      }
      return null;
    })
    .catch((error) => {
      console.error('Redirect sign in failed:', error);
      setMessage(formatAuthError(error), 'error');
    });
}

