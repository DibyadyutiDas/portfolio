import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

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

const userMenu = document.getElementById('user-menu');
const userProfileLink = document.getElementById('user-profile-link');
const userAvatarContainer = document.getElementById('user-avatar-container');
const userDropdown = document.getElementById('user-dropdown');
const userDisplayName = document.getElementById('user-display-name');
const logoutBtn = document.getElementById('logout-btn');

const defaultAvatarMarkup = userAvatarContainer ? userAvatarContainer.innerHTML : '';

function setMenuState(isOpen) {
  if (!userMenu || !userProfileLink || !userDropdown) return;
  userMenu.classList.toggle('open', isOpen);
  userProfileLink.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  userDropdown.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
}

function setLoggedOutUI() {
  if (userMenu) userMenu.classList.remove('is-authenticated');
  if (userDisplayName) userDisplayName.textContent = 'Guest';
  if (userAvatarContainer) userAvatarContainer.innerHTML = defaultAvatarMarkup || '<i class="fas fa-user" id="user-avatar-icon"></i>';
  if (userProfileLink) {
    userProfileLink.href = 'login.html';
    userProfileLink.title = 'Sign in';
    userProfileLink.removeAttribute('role');
  }
  setMenuState(false);
}

function setLoggedInUI(user) {
  const displayName = user.displayName || user.email || 'Friend';

  if (userMenu) userMenu.classList.add('is-authenticated');
  if (userDisplayName) userDisplayName.textContent = displayName;
  if (userAvatarContainer) {
    if (user.photoURL) {
      userAvatarContainer.innerHTML = `<img class="user-avatar" src="${user.photoURL}" alt="${displayName}">`;
    } else if (defaultAvatarMarkup) {
      userAvatarContainer.innerHTML = defaultAvatarMarkup;
    }
  }
  if (userProfileLink) {
    userProfileLink.href = '#';
    userProfileLink.title = `Logged in as ${displayName}`;
    userProfileLink.setAttribute('role', 'button');
  }
}

if (userProfileLink && userMenu) {
  userProfileLink.addEventListener('click', (event) => {
    if (!userMenu.classList.contains('is-authenticated')) return;
    event.preventDefault();
    setMenuState(!userMenu.classList.contains('open'));
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userProfile');
      setMenuState(false);
      window.location.href = 'login.html';
    }
  });
}

document.addEventListener('click', (event) => {
  if (!userMenu || !userMenu.classList.contains('open')) return;
  if (!userMenu.contains(event.target)) setMenuState(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenuState(false);
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    setLoggedInUI(user);
    const token = await user.getIdToken();
    localStorage.setItem('authToken', token);
    localStorage.setItem('userProfile', JSON.stringify({
      displayName: user.displayName || user.email || 'Friend',
      email: user.email || '',
      avatar: user.photoURL || ''
    }));
  } else {
    setLoggedOutUI();
    localStorage.removeItem('authToken');
    localStorage.removeItem('userProfile');
  }
});
