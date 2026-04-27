import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// TODO: Replace this with your actual Firebase project config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const providerGoogle = new GoogleAuthProvider();
const providerGithub = new GithubAuthProvider();

const apiBase = (window.APP_CONFIG && window.APP_CONFIG.apiBase) || localStorage.getItem('apiBase') || 'http://localhost:4000';

const googleBtn = document.getElementById('google-btn');
const githubBtn = document.getElementById('github-btn');

async function handleSocialLogin(provider) {
  try {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
    
    // Sync with backend
    const response = await fetch(`${apiBase}/api/user/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
         displayName: result.user.displayName,
         avatar: result.user.photoURL
      })
    });
    
    if (response.ok) {
      localStorage.setItem('authToken', token);
      window.location.href = 'index.html'; // Redirect to home page
    } else {
      throw new Error('Backend sync failed');
    }
  } catch (error) {
    console.error("Error signing in:", error);
    alert("Sign in failed. Check console for details.");
  }
}

if (googleBtn) googleBtn.addEventListener('click', () => handleSocialLogin(providerGoogle));
if (githubBtn) githubBtn.addEventListener('click', () => handleSocialLogin(providerGithub));

const emailSubmit = document.getElementById('signin-btn');
if (emailSubmit) {
  emailSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    window.alert('Please use Google or GitHub to sign in.');
  });
}

