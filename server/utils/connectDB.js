const mongoose = require('mongoose');

async function connectDB(mongoUri) {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is required to start the server');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(mongoUri, {
    autoIndex: true,
    serverSelectionTimeoutMS: 10000
  });

  return mongoose.connection;
}

module.exports = connectDB;
