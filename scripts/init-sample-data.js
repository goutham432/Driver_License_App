/**
 * Initialize Sample Data Script
 * Populates database with sample tests and data
 */

const mongoose = require('mongoose');
const Test = require('../models/Test');
require('dotenv').config();

const sampleTests = [
  {
    title: 'California Practice Test - Basic Rules',
    state: 'CA',
    category: 'practice',
    description: 'Basic traffic rules and regulations for California',
    difficulty: 'easy',
    passingScore: 80,
    timeLimit: 30,
    questions: [
      {
        question: 'What is the speed limit in a school zone?',
        options: ['15 mph', '20 mph', '25 mph', '30 mph'],
        correctAnswer: 2,
        explanation: 'The speed limit in a school zone is typically 25 mph when children are present.'
      },
      {
        question: 'When should you use your turn signals?',
        options: ['Only when changing lanes', 'At least 100 feet before turning', 'Only in heavy traffic', 'Never'],
        correctAnswer: 1,
        explanation: 'You should signal at least 100 feet before making a turn or changing lanes.'
      },
      {
        question: 'What does a red traffic light mean?',
        options: ['Slow down', 'Stop completely', 'Proceed with caution', 'Yield'],
        correctAnswer: 1,
        explanation: 'A red traffic light means you must come to a complete stop.'
      }
    ]
  },
  {
    title: 'Texas Practice Test - Road Signs',
    state: 'TX',
    category: 'practice',
    description: 'Learn about road signs in Texas',
    difficulty: 'medium',
    passingScore: 80,
    timeLimit: 30,
    questions: [
      {
        question: 'What does a yellow diamond-shaped sign indicate?',
        options: ['Stop ahead', 'Warning', 'Speed limit', 'No parking'],
        correctAnswer: 1,
        explanation: 'Yellow diamond-shaped signs are warning signs that alert drivers to potential hazards.'
      },
      {
        question: 'What does a red octagonal sign mean?',
        options: ['Yield', 'Stop', 'No entry', 'Wrong way'],
        correctAnswer: 1,
        explanation: 'A red octagonal sign is a stop sign, requiring a complete stop.'
      },
      {
        question: 'What color are construction signs?',
        options: ['Red', 'Blue', 'Orange', 'Green'],
        correctAnswer: 2,
        explanation: 'Construction and work zone signs are typically orange.'
      }
    ]
  },
  {
    title: 'Florida Mock Test - Complete',
    state: 'FL',
    category: 'mock',
    description: 'Complete mock test for Florida driver license',
    difficulty: 'hard',
    passingScore: 80,
    timeLimit: 45,
    questions: [
      {
        question: 'What is the legal blood alcohol limit for drivers 21 and over?',
        options: ['0.05%', '0.08%', '0.10%', '0.15%'],
        correctAnswer: 1,
        explanation: 'The legal blood alcohol limit is 0.08% for drivers 21 and over.'
      },
      {
        question: 'When should you yield the right-of-way?',
        options: ['At stop signs', 'To emergency vehicles', 'At green lights', 'Never'],
        correctAnswer: 1,
        explanation: 'You must always yield the right-of-way to emergency vehicles with lights and sirens.'
      },
      {
        question: 'What should you do if you miss your exit on the highway?',
        options: ['Reverse', 'Stop immediately', 'Continue to next exit', 'Make a U-turn'],
        correctAnswer: 2,
        explanation: 'If you miss your exit, continue to the next exit. Never reverse or stop on the highway.'
      }
    ]
  },
  {
    title: 'New York Official Test Prep',
    state: 'NY',
    category: 'official',
    description: 'Official test preparation for New York',
    difficulty: 'hard',
    passingScore: 80,
    timeLimit: 45,
    questions: [
      {
        question: 'What is the penalty for texting while driving in New York?',
        options: ['Warning', 'Fine only', 'Fine and points', 'License suspension'],
        correctAnswer: 2,
        explanation: 'Texting while driving results in fines and points on your license.'
      },
      {
        question: 'When parking on a hill, which way should you turn your wheels?',
        options: ['Straight', 'Away from curb', 'Toward curb', 'Does not matter'],
        correctAnswer: 1,
        explanation: 'When parking uphill, turn wheels away from the curb. When parking downhill, turn toward the curb.'
      },
      {
        question: 'What is the minimum following distance in good conditions?',
        options: ['1 second', '2 seconds', '3 seconds', '4 seconds'],
        correctAnswer: 2,
        explanation: 'Maintain at least a 3-second following distance in good conditions.'
      }
    ]
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/driver-license-platform');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const initData = async () => {
  try {
    await connectDB();

    // Clear existing tests
    await Test.deleteMany({});
    console.log('Cleared existing tests');

    // Insert sample tests
    const inserted = await Test.insertMany(sampleTests);
    console.log(`Inserted ${inserted.length} sample tests`);

    console.log('Sample data initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing data:', error);
    process.exit(1);
  }
};

initData();


