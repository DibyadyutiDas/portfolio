require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/connectDB');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

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

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../')));

// API Routes
app.use('/api/user', require('./routes/user'));
app.use('/api/contact', require('./routes/contact'));

app.use((err, _req, res, _next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ message: 'Unexpected error', detail: err.message });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Server listening on port ${PORT}`);
});
