const express = require('express');
const { verifyToken } = require('../utils/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// Synchronize Firebase user details with MongoDB
router.post('/sync', verifyToken, async (req, res) => {
  try {
    const { uid, email, name, picture } = req.user;
    // req.user has decoded info from Firebase Token, but the client can also send updated fields
    const displayName = req.body.displayName || name || 'Anonymous User';
    const avatar = req.body.avatar || picture || '';
    const devicePayload = req.body.device || {};
    const deviceId = req.body.deviceId || devicePayload.deviceId || '';
    const loginAt = new Date();

    // Identify provider (google.com, github.com, etc via firebase token's firebase.sign_in_provider)
    const provider = req.user.firebase?.sign_in_provider || 'unknown';

    const deviceSnapshot = {
      deviceId,
      userAgent: devicePayload.userAgent || '',
      platform: devicePayload.platform || '',
      language: devicePayload.language || '',
      timezone: devicePayload.timezone || '',
      vendor: devicePayload.vendor || '',
      memory: typeof devicePayload.memory === 'number' ? devicePayload.memory : null,
      cores: typeof devicePayload.cores === 'number' ? devicePayload.cores : null,
      mobile: typeof devicePayload.mobile === 'boolean' ? devicePayload.mobile : null,
      touchPoints: typeof devicePayload.touchPoints === 'number' ? devicePayload.touchPoints : null,
      screen: devicePayload.screen || {},
      connection: devicePayload.connection || null,
      lastSeenAt: loginAt
    };

    const update = {
      $set: {
        provider,
        providerId: uid,
        displayName,
        email,
        avatar,
        lastLoginAt: loginAt,
        lastLoginIp: req.ip,
        lastDevice: deviceSnapshot
      },
      $push: {
        deviceHistory: {
          $each: [deviceSnapshot],
          $slice: -5
        }
      }
    };

    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const user = await User.findOneAndUpdate({ providerId: uid }, update, options);

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: 'Internal server error while syncing user' });
  }
});

// Get current user's profile from MongoDB
router.get('/me', verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const user = await User.findOne({ providerId: uid });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
