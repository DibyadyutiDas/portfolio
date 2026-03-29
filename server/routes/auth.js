const express = require('express');
const passport = require('../utils/passport');

const router = express.Router();
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

function ensureStrategy(provider) {
  const enabled = {
    google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    github: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET)
  };

  return (req, res, next) => {
    if (!enabled[provider]) {
      return res.status(503).json({ message: `${provider} login is not configured` });
    }
    return next();
  };
}

function sanitizeUser(user) {
  if (!user) return null;
  const { _id, id, provider, providerId, displayName, email, avatar, profileUrl, createdAt, updatedAt } = user;
  return { id: id || _id, provider, providerId, displayName, email, avatar, profileUrl, createdAt, updatedAt };
}

router.get('/me', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ user: null });
  }
  return res.json({ user: sanitizeUser(req.user) });
});

router.post('/logout', (req, res, next) => {
  if (typeof req.logout === 'function') {
    req.logout((err) => {
      if (err) return next(err);
      req.session?.destroy(() => {
        res.clearCookie('connect.sid');
        return res.json({ success: true });
      });
    });
  } else {
    req.session?.destroy(() => {
      res.clearCookie('connect.sid');
      return res.json({ success: true });
    });
  }
});

router.get('/google', ensureStrategy('google'), passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  ensureStrategy('google'),
  passport.authenticate('google', { failureRedirect: `${clientOrigin}/login.html?error=google` }),
  (_req, res) => res.redirect(`${clientOrigin}/login.html?status=success`)
);

router.get('/github', ensureStrategy('github'), passport.authenticate('github', { scope: ['read:user', 'user:email'] }));

router.get(
  '/github/callback',
  ensureStrategy('github'),
  passport.authenticate('github', { failureRedirect: `${clientOrigin}/login.html?error=github` }),
  (_req, res) => res.redirect(`${clientOrigin}/login.html?status=success`)
);

module.exports = router;
