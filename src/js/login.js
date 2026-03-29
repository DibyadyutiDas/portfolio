(() => {
  const apiBase = (window.APP_CONFIG && window.APP_CONFIG.apiBase) || localStorage.getItem('apiBase') || 'http://localhost:4000';

  const googleBtn = document.getElementById('google-btn');
  const githubBtn = document.getElementById('github-btn');

  const setButtons = () => {
    if (googleBtn) googleBtn.href = `${apiBase}/auth/google`;
    if (githubBtn) githubBtn.href = `${apiBase}/auth/github`;
  };

  const handleEmailSubmit = () => {
    window.alert('Please use Google or GitHub to sign in.');
  };

  const emailSubmit = document.getElementById('email-submit');
  if (emailSubmit) {
    emailSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      handleEmailSubmit();
    });
  }

  setButtons();
})();
