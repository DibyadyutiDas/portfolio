import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const resetForm = document.getElementById('reset-form');
const resetEmail = document.getElementById('reset-email');
const resetBtn = document.getElementById('reset-btn');
const resetMessage = document.getElementById('reset-message');

function setMessage(text, type) {
  if (!resetMessage) return;
  resetMessage.textContent = text || '';
  resetMessage.className = `auth-message${type ? ` is-${type}` : ''}`;
}

const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if ((savedTheme && savedTheme === 'dark') || (!savedTheme && prefersDark)) {
  document.body.classList.add('dark');
}

function setLoading(button, isLoading, loadingText) {
  if (!button) return;
  const originalText = button.dataset.originalText || button.textContent;
  if (!button.dataset.originalText) button.dataset.originalText = originalText;
  button.disabled = isLoading;
  button.textContent = isLoading ? loadingText : button.dataset.originalText;
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

if (resetForm) {
  resetForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!auth) return;

    const email = resetEmail ? resetEmail.value.trim() : '';
    if (!email) {
      setMessage('Enter a valid email address.', 'error');
      return;
    }

    setLoading(resetBtn, true, 'Sending...');
    setMessage('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Reset link sent. Check your inbox.', 'success');
    } catch (error) {
      console.error('Password reset failed:', error);
      let errMsg = 'Unable to send reset link. Try again later.';
      if (error && error.code === 'auth/user-not-found') {
        errMsg = 'No account found with this email address.';
      } else if (error && error.message) {
        errMsg = error.message;
      }
      setMessage(errMsg, 'error');
    } finally {
      setLoading(resetBtn, false);
    }
  });
}
