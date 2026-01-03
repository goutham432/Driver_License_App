/**
 * Initialize Sample Data for Kubernetes MongoDB
 * This script can be run inside a Kubernetes pod to populate the database
 * 
 * Usage:
 *   1. Copy this file to a pod: kubectl cp scripts/init-k8s-sample-data.js MONGODB_POD_NAME:/tmp/init.js -n driver-license-platform
 *   2. Run: kubectl exec -it MONGODB_POD_NAME -n driver-license-platform -- mongosh driver-license-platform /tmp/init.js
 * 
 * OR use Node.js:
 *   1. Set MONGODB_URI environment variable to: mongodb://mongodb-service:27017/driver-license-platform
 *   2. Run: node scripts/init-k8s-sample-data.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Test = require('../models/Test');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// MongoDB connection string for Kubernetes
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongodb-service:27017/driver-license-platform';

// Sample Tests with 10-15 questions each
const sampleTests = [
  {
    title: 'California Practice Test - Basic Rules & Regulations',
    state: 'CA',
    category: 'practice',
    description: 'Comprehensive practice test covering California traffic rules, signs, and regulations. Perfect for first-time drivers.',
    difficulty: 'easy',
    passingScore: 80,
    timeLimit: 30,
    isActive: true,
    questions: [
      {
        question: 'What is the speed limit in a school zone in California?',
        options: ['15 mph', '20 mph', '25 mph', '30 mph'],
        correctAnswer: 2,
        explanation: 'The speed limit in a school zone is 25 mph when children are present or during school hours.'
      },
      {
        question: 'When should you use your turn signals?',
        options: ['Only when changing lanes', 'At least 100 feet before turning', 'Only in heavy traffic', 'Never'],
        correctAnswer: 1,
        explanation: 'You must signal at least 100 feet before making a turn or changing lanes in California.'
      },
      {
        question: 'What does a red traffic light mean?',
        options: ['Slow down', 'Stop completely', 'Proceed with caution', 'Yield'],
        correctAnswer: 1,
        explanation: 'A red traffic light means you must come to a complete stop before the stop line or crosswalk.'
      },
      {
        question: 'What is the legal blood alcohol limit for drivers 21 and over in California?',
        options: ['0.05%', '0.08%', '0.10%', '0.15%'],
        correctAnswer: 1,
        explanation: 'The legal blood alcohol limit is 0.08% for drivers 21 and over. For drivers under 21, it is 0.01%.'
      },
      {
        question: 'When parking on a hill facing uphill, which way should you turn your wheels?',
        options: ['Away from the curb', 'Toward the curb', 'Straight', 'It doesn\'t matter'],
        correctAnswer: 0,
        explanation: 'When parking uphill, turn your wheels away from the curb so if the car rolls, it will roll away from the street.'
      },
      {
        question: 'What should you do when you see a yellow traffic light?',
        options: ['Speed up to beat the red light', 'Stop if you can do so safely', 'Continue through the intersection', 'Yield to oncoming traffic'],
        correctAnswer: 1,
        explanation: 'A yellow light means the light is about to turn red. Stop if you can do so safely, otherwise proceed with caution.'
      },
      {
        question: 'How far should you stay behind the vehicle in front of you?',
        options: ['1 second', '2 seconds', '3 seconds', '5 seconds'],
        correctAnswer: 2,
        explanation: 'You should maintain at least a 3-second following distance under normal conditions, and more in bad weather.'
      },
      {
        question: 'What does a flashing yellow light mean?',
        options: ['Stop', 'Proceed with caution', 'Yield', 'No turn allowed'],
        correctAnswer: 1,
        explanation: 'A flashing yellow light means proceed with caution. Slow down and be prepared to stop.'
      },
      {
        question: 'When can you make a U-turn in California?',
        options: ['Never', 'Only at intersections', 'Where not prohibited by signs', 'Only on highways'],
        correctAnswer: 2,
        explanation: 'You can make a U-turn where not prohibited by signs, except in business districts, near fire stations, or where visibility is limited.'
      },
      {
        question: 'What is the minimum age to get a learner\'s permit in California?',
        options: ['14', '15', '15.5', '16'],
        correctAnswer: 2,
        explanation: 'You must be at least 15.5 years old to get a learner\'s permit in California.'
      },
      {
        question: 'What should you do if you miss your exit on a freeway?',
        options: ['Back up', 'Make a U-turn', 'Continue to the next exit', 'Stop on the shoulder'],
        correctAnswer: 2,
        explanation: 'Never back up on a freeway. Continue to the next exit and turn around safely.'
      },
      {
        question: 'When should you yield to pedestrians?',
        options: ['Only at crosswalks', 'Only when they have a walk signal', 'Always, especially at crosswalks', 'Never'],
        correctAnswer: 2,
        explanation: 'You must always yield to pedestrians, especially at crosswalks and intersections.'
      }
    ]
  },
  {
    title: 'Texas Practice Test - Road Signs & Safety',
    state: 'TX',
    category: 'practice',
    description: 'Test your knowledge of Texas road signs, traffic laws, and safe driving practices.',
    difficulty: 'medium',
    passingScore: 80,
    timeLimit: 30,
    isActive: true,
    questions: [
      {
        question: 'What does a diamond-shaped sign indicate?',
        options: ['Stop', 'Warning', 'Yield', 'Speed limit'],
        correctAnswer: 1,
        explanation: 'Diamond-shaped signs are warning signs that alert drivers to potential hazards ahead.'
      },
      {
        question: 'What is the speed limit on most Texas highways?',
        options: ['55 mph', '65 mph', '70 mph', '75 mph'],
        correctAnswer: 2,
        explanation: 'The speed limit on most Texas highways is 70 mph, though some rural highways allow 75 mph.'
      },
      {
        question: 'When should you use your headlights in Texas?',
        options: ['Only at night', 'From 30 minutes after sunset to 30 minutes before sunrise', 'Only in rain', 'Never'],
        correctAnswer: 1,
        explanation: 'You must use headlights from 30 minutes after sunset to 30 minutes before sunrise, and when visibility is less than 1,000 feet.'
      },
      {
        question: 'What should you do when approaching a school bus with flashing red lights?',
        options: ['Slow down', 'Stop at least 20 feet away', 'Pass on the left', 'Honk your horn'],
        correctAnswer: 1,
        explanation: 'You must stop at least 20 feet away from a school bus with flashing red lights, whether you are behind it or approaching it from the front.'
      },
      {
        question: 'What is the penalty for a first-time DUI in Texas?',
        options: ['Fine only', 'Fine and license suspension', 'Jail time only', 'No penalty'],
        correctAnswer: 1,
        explanation: 'A first-time DUI in Texas can result in fines up to $2,000, license suspension, and up to 180 days in jail.'
      },
      {
        question: 'How long is a Texas driver\'s license valid?',
        options: ['4 years', '6 years', '8 years', '10 years'],
        correctAnswer: 1,
        explanation: 'A Texas driver\'s license is valid for 6 years for drivers under 85, and 2 years for drivers 85 and older.'
      },
      {
        question: 'What does a red octagonal sign mean?',
        options: ['Yield', 'Stop', 'No entry', 'Wrong way'],
        correctAnswer: 1,
        explanation: 'A red octagonal sign means STOP. You must come to a complete stop.'
      },
      {
        question: 'What should you do if your vehicle starts to hydroplane?',
        options: ['Brake hard', 'Accelerate', 'Steer straight and ease off the gas', 'Turn sharply'],
        correctAnswer: 2,
        explanation: 'If you hydroplane, do not brake or turn sharply. Steer straight and ease off the accelerator until you regain control.'
      },
      {
        question: 'What is the minimum age to get a learner\'s permit in Texas?',
        options: ['14', '15', '16', '17'],
        correctAnswer: 1,
        explanation: 'You must be at least 15 years old to get a learner\'s permit in Texas.'
      },
      {
        question: 'When can you pass on the right in Texas?',
        options: ['Never', 'On a one-way street', 'When the vehicle ahead is turning left', 'Both B and C'],
        correctAnswer: 3,
        explanation: 'You can pass on the right on a one-way street or when the vehicle ahead is turning left and there is room to pass safely.'
      },
      {
        question: 'What does a yellow traffic light mean?',
        options: ['Go', 'Stop', 'Caution - prepare to stop', 'Yield'],
        correctAnswer: 2,
        explanation: 'A yellow light means the light is about to turn red. Stop if you can do so safely.'
      },
      {
        question: 'How far ahead should you signal before turning?',
        options: ['50 feet', '100 feet', '150 feet', '200 feet'],
        correctAnswer: 1,
        explanation: 'You must signal at least 100 feet before making a turn or changing lanes.'
      },
      {
        question: 'What should you do if you are involved in a minor accident in Texas?',
        options: ['Leave immediately', 'Move vehicles to safety and exchange information', 'Call 911 for all accidents', 'Ignore it'],
        correctAnswer: 1,
        explanation: 'For minor accidents, move vehicles to safety if possible, exchange information with other drivers, and file a report if there is significant damage.'
      }
    ]
  },
  {
    title: 'Florida Practice Test - Traffic Laws',
    state: 'FL',
    category: 'practice',
    description: 'Master Florida\'s traffic laws, road signs, and driving regulations.',
    difficulty: 'medium',
    passingScore: 80,
    timeLimit: 30,
    isActive: true,
    questions: [
      {
        question: 'What is the speed limit in a Florida school zone?',
        options: ['15 mph', '20 mph', '25 mph', '30 mph'],
        correctAnswer: 1,
        explanation: 'The speed limit in a Florida school zone is 20 mph when children are present.'
      },
      {
        question: 'What should you do when you see a flashing yellow arrow?',
        options: ['Stop', 'Yield to oncoming traffic, then turn', 'Proceed with caution', 'No turn allowed'],
        correctAnswer: 1,
        explanation: 'A flashing yellow arrow means you may turn after yielding to oncoming traffic and pedestrians.'
      },
      {
        question: 'What is the minimum age to get a learner\'s permit in Florida?',
        options: ['14', '15', '16', '17'],
        correctAnswer: 1,
        explanation: 'You must be at least 15 years old to get a learner\'s permit in Florida.'
      },
      {
        question: 'How long is a Florida driver\'s license valid?',
        options: ['4 years', '6 years', '8 years', '10 years'],
        correctAnswer: 2,
        explanation: 'A Florida driver\'s license is valid for 8 years.'
      },
      {
        question: 'What does a red traffic light mean?',
        options: ['Slow down', 'Stop completely', 'Proceed with caution', 'Yield'],
        correctAnswer: 1,
        explanation: 'A red traffic light means you must come to a complete stop.'
      },
      {
        question: 'When should you use your turn signals in Florida?',
        options: ['Only when changing lanes', 'At least 100 feet before turning', 'Only in heavy traffic', 'Never'],
        correctAnswer: 1,
        explanation: 'You must signal at least 100 feet before making a turn or changing lanes.'
      },
      {
        question: 'What is the legal blood alcohol limit for drivers 21 and over in Florida?',
        options: ['0.05%', '0.08%', '0.10%', '0.15%'],
        correctAnswer: 1,
        explanation: 'The legal blood alcohol limit is 0.08% for drivers 21 and over.'
      },
      {
        question: 'What should you do if you miss your exit on a Florida highway?',
        options: ['Back up', 'Make a U-turn', 'Continue to the next exit', 'Stop on the shoulder'],
        correctAnswer: 2,
        explanation: 'Never back up on a highway. Continue to the next exit and turn around safely.'
      },
      {
        question: 'What does a yellow traffic light mean?',
        options: ['Go', 'Stop', 'Caution - prepare to stop', 'Yield'],
        correctAnswer: 2,
        explanation: 'A yellow light means the light is about to turn red. Stop if you can do so safely.'
      },
      {
        question: 'How far should you stay behind the vehicle in front of you?',
        options: ['1 second', '2 seconds', '3 seconds', '5 seconds'],
        correctAnswer: 2,
        explanation: 'You should maintain at least a 3-second following distance under normal conditions.'
      },
      {
        question: 'What does a flashing red light mean?',
        options: ['Stop and proceed when safe', 'Yield', 'Caution', 'No entry'],
        correctAnswer: 0,
        explanation: 'A flashing red light means stop, then proceed when it is safe to do so.'
      },
      {
        question: 'When can you make a U-turn in Florida?',
        options: ['Never', 'Only at intersections', 'Where not prohibited by signs', 'Only on highways'],
        correctAnswer: 2,
        explanation: 'You can make a U-turn where not prohibited by signs, except in business districts or where visibility is limited.'
      }
    ]
  },
  {
    title: 'New York Practice Test - City Driving',
    state: 'NY',
    category: 'practice',
    description: 'Navigate New York\'s unique traffic laws, parking regulations, and city driving challenges.',
    difficulty: 'hard',
    passingScore: 80,
    timeLimit: 30,
    isActive: true,
    questions: [
      {
        question: 'What is the speed limit in New York City unless otherwise posted?',
        options: ['20 mph', '25 mph', '30 mph', '35 mph'],
        correctAnswer: 1,
        explanation: 'The default speed limit in New York City is 25 mph unless otherwise posted.'
      },
      {
        question: 'What should you do when approaching a school bus with flashing red lights in New York?',
        options: ['Slow down', 'Stop at least 20 feet away', 'Pass on the left', 'Honk your horn'],
        correctAnswer: 1,
        explanation: 'You must stop at least 20 feet away from a school bus with flashing red lights.'
      },
      {
        question: 'What is the minimum age to get a learner\'s permit in New York?',
        options: ['15', '16', '17', '18'],
        correctAnswer: 1,
        explanation: 'You must be at least 16 years old to get a learner\'s permit in New York.'
      },
      {
        question: 'How long is a New York driver\'s license valid?',
        options: ['4 years', '6 years', '8 years', '10 years'],
        correctAnswer: 2,
        explanation: 'A New York driver\'s license is valid for 8 years.'
      },
      {
        question: 'What does a red traffic light mean?',
        options: ['Slow down', 'Stop completely', 'Proceed with caution', 'Yield'],
        correctAnswer: 1,
        explanation: 'A red traffic light means you must come to a complete stop.'
      },
      {
        question: 'When should you use your turn signals in New York?',
        options: ['Only when changing lanes', 'At least 100 feet before turning', 'Only in heavy traffic', 'Never'],
        correctAnswer: 1,
        explanation: 'You must signal at least 100 feet before making a turn or changing lanes.'
      },
      {
        question: 'What is the legal blood alcohol limit for drivers 21 and over in New York?',
        options: ['0.05%', '0.08%', '0.10%', '0.15%'],
        correctAnswer: 1,
        explanation: 'The legal blood alcohol limit is 0.08% for drivers 21 and over.'
      },
      {
        question: 'What should you do if you miss your exit on a New York highway?',
        options: ['Back up', 'Make a U-turn', 'Continue to the next exit', 'Stop on the shoulder'],
        correctAnswer: 2,
        explanation: 'Never back up on a highway. Continue to the next exit and turn around safely.'
      },
      {
        question: 'What does a yellow traffic light mean?',
        options: ['Go', 'Stop', 'Caution - prepare to stop', 'Yield'],
        correctAnswer: 2,
        explanation: 'A yellow light means the light is about to turn red. Stop if you can do so safely.'
      },
      {
        question: 'How far should you stay behind the vehicle in front of you?',
        options: ['1 second', '2 seconds', '3 seconds', '5 seconds'],
        correctAnswer: 2,
        explanation: 'You should maintain at least a 3-second following distance under normal conditions.'
      },
      {
        question: 'What does a flashing red light mean?',
        options: ['Stop and proceed when safe', 'Yield', 'Caution', 'No entry'],
        correctAnswer: 0,
        explanation: 'A flashing red light means stop, then proceed when it is safe to do so.'
      },
      {
        question: 'When can you make a U-turn in New York?',
        options: ['Never', 'Only at intersections', 'Where not prohibited by signs', 'Only on highways'],
        correctAnswer: 2,
        explanation: 'You can make a U-turn where not prohibited by signs, except in business districts or where visibility is limited.'
      },
      {
        question: 'What should you do when parking on a hill in New York?',
        options: ['Turn wheels toward curb', 'Turn wheels away from curb', 'Leave wheels straight', 'It doesn\'t matter'],
        correctAnswer: 0,
        explanation: 'When parking on a hill, turn your wheels toward the curb to prevent the car from rolling into traffic.'
      },
      {
        question: 'What is the penalty for texting while driving in New York?',
        options: ['Warning only', 'Fine and points on license', 'License suspension', 'Jail time'],
        correctAnswer: 1,
        explanation: 'Texting while driving in New York can result in fines and points on your license.'
      }
    ]
  }
];

async function initializeData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing data...');
    await Test.deleteMany({});
    await User.deleteMany({ email: { $ne: 'admin@example.com' } }); // Keep admin user if exists
    await Appointment.deleteMany({});
    console.log('✅ Cleared existing data');

    // Insert tests
    console.log('Inserting sample tests...');
    const insertedTests = await Test.insertMany(sampleTests);
    console.log(`✅ Inserted ${insertedTests.length} tests`);

    console.log('✅ Sample data initialization complete!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Tests: ${insertedTests.length}`);
    console.log(`   - CA: ${insertedTests.filter(t => t.state === 'CA').length}`);
    console.log(`   - TX: ${insertedTests.filter(t => t.state === 'TX').length}`);
    console.log(`   - FL: ${insertedTests.filter(t => t.state === 'FL').length}`);
    console.log(`   - NY: ${insertedTests.filter(t => t.state === 'NY').length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing data:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initializeData();
}

module.exports = { initializeData, sampleTests };

