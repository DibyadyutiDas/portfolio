const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

const callbackBase = process.env.OAUTH_CALLBACK_BASE || `http://localhost:${process.env.PORT || 4000}`;
const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const githubEnabled = Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);

async function upsertOAuthUser({ provider, profile }) {
  const email = profile.emails && profile.emails.length ? profile.emails[0].value : undefined;
  const avatar = profile.photos && profile.photos.length ? profile.photos[0].value : undefined;

  const update = {
    provider,
    providerId: profile.id,
    displayName: profile.displayName || profile.username || 'User',
    email,
    avatar,
    profileUrl: profile.profileUrl
  };

  const options = { upsert: true, new: true, setDefaultsOnInsert: true };
  const user = await User.findOneAndUpdate({ provider, providerId: profile.id }, update, options);
  return user;
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).lean();
    done(null, user);
  } catch (err) {
    done(err);
  }
});

if (googleEnabled) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${callbackBase}/auth/google/callback`
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await upsertOAuthUser({ provider: 'google', profile });
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}

if (githubEnabled) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${callbackBase}/auth/github/callback`
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await upsertOAuthUser({ provider: 'github', profile });
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}

module.exports = passport;
