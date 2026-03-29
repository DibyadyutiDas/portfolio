require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const passport = require('./utils/passport');
const connectDB = require('./utils/connectDB');

const app = express();
const PORT = process.env.PORT || 4000;
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
const allowedOrigins = (process.env.ALLOWED_ORIGINS || clientOrigin).split(',').map((o) => o.trim()).filter(Boolean);
const isProd = process.env.NODE_ENV === 'production';

(async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    // eslint-disable-next-line no-console
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
})();

app.set('trust proxy', 1);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 14 * 24 * 60 * 60
    })
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/auth', require('./routes/auth'));

app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ message: 'Unexpected error', detail: err.message });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Auth server listening on port ${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`Client origin: ${clientOrigin}`);
});
