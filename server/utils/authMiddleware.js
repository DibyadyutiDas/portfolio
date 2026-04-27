const admin = require('firebase-admin');

// Initialize Firebase Admin (requires FIREBASE_SERVICE_ACCOUNT_KEY in .env, typically a base64 encoded JSON string, or just fallback if not set yet to avoid crashing)
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString());
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin initialized');
  } else {
    console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT_KEY not found in .env. Auth routes will fail.');
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin:', error.message);
}

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = { verifyToken, admin };
