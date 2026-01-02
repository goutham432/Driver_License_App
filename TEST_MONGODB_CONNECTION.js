// Test MongoDB Connection Script
require('dotenv').config();
const mongoose = require('mongoose');

const testConnection = async () => {
  console.log('');
  console.log('========================================');
  console.log('  Testing MongoDB Atlas Connection');
  console.log('========================================');
  console.log('');
  console.log('Connection String:', process.env.MONGODB_URI ? 'Found' : 'NOT FOUND');
  console.log('');

  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env file');
    process.exit(1);
  }

  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    console.log('Cluster: cluster0.zouxeya.mongodb.net');
    console.log('Database: driver-license-platform');
    console.log('');

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    });

    console.log('');
    console.log('========================================');
    console.log('  ✅ SUCCESS! MongoDB Connected!');
    console.log('========================================');
    console.log('');
    console.log('Connection Details:');
    console.log('  Host:', conn.connection.host);
    console.log('  Database:', conn.connection.name);
    console.log('  Ready State:', conn.connection.readyState === 1 ? 'Connected' : 'Not Connected');
    console.log('');

    // Test a simple operation
    try {
      const collections = await conn.connection.db.listCollections().toArray();
      console.log('Collections in database:', collections.length);
      if (collections.length > 0) {
        console.log('Collection names:', collections.map(c => c.name).join(', '));
      } else {
        console.log('  (Database is empty - ready for data)');
      }
    } catch (err) {
      console.log('  (Could not list collections, but connection is working)');
    }

    console.log('');
    console.log('✅ MongoDB connection is working perfectly!');
    console.log('');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.log('');
    console.log('========================================');
    console.log('  ❌ CONNECTION FAILED');
    console.log('========================================');
    console.log('');
    console.error('Error:', error.message);
    console.log('');

    if (error.message.includes('authentication failed')) {
      console.log('Possible issues:');
      console.log('  • Username or password is incorrect');
      console.log('  • Check MongoDB Atlas Database Access settings');
    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('timeout')) {
      console.log('Possible issues:');
      console.log('  • Network access not configured in MongoDB Atlas');
      console.log('  • Go to Network Access and add your IP or "Allow Access from Anywhere"');
      console.log('  • Firewall blocking connection');
    } else if (error.message.includes('bad auth')) {
      console.log('Possible issues:');
      console.log('  • Wrong username or password');
      console.log('  • User not created in MongoDB Atlas');
    }

    console.log('');
    console.log('Check MongoDB Atlas:');
    console.log('  1. Network Access: https://cloud.mongodb.com/v2#/security/network/whitelist');
    console.log('  2. Database Access: https://cloud.mongodb.com/v2#/security/database/users');
    console.log('');

    process.exit(1);
  }
};

testConnection();


