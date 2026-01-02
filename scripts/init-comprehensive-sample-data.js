/**
 * Comprehensive Sample Data Initialization
 * Creates 4 sample tests with 10-15 questions each
 * Also creates sample users and appointments
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Test = require('../models/Test');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

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
        options: ['Straight', 'Away from the curb', 'Toward the curb', 'Does not matter'],
        correctAnswer: 1,
        explanation: 'When parking uphill, turn your wheels away from the curb. When parking downhill, turn toward the curb.'
      },
      {
        question: 'What should you do when you see a yellow traffic light?',
        options: ['Speed up to beat the red', 'Stop if you can do so safely', 'Continue at same speed', 'Yield to oncoming traffic'],
        correctAnswer: 1,
        explanation: 'A yellow light means stop if you can do so safely. If you cannot stop safely, proceed with caution.'
      },
      {
        question: 'What is the minimum following distance in good weather conditions?',
        options: ['1 second', '2 seconds', '3 seconds', '4 seconds'],
        correctAnswer: 2,
        explanation: 'Maintain at least a 3-second following distance in good conditions. Increase in bad weather.'
      },
      {
        question: 'When should you yield the right-of-way?',
        options: ['At green lights', 'To emergency vehicles with lights and sirens', 'At stop signs when you arrive first', 'Never'],
        correctAnswer: 1,
        explanation: 'You must always yield the right-of-way to emergency vehicles with lights and sirens activated.'
      },
      {
        question: 'What does a solid yellow line on your side of the road mean?',
        options: ['You may pass', 'No passing allowed', 'Pass with caution', 'Speed limit zone'],
        correctAnswer: 1,
        explanation: 'A solid yellow line on your side means no passing is allowed. You may not cross it.'
      },
      {
        question: 'What should you do if you miss your exit on the highway?',
        options: ['Reverse to the exit', 'Stop immediately', 'Continue to the next exit', 'Make a U-turn'],
        correctAnswer: 2,
        explanation: 'If you miss your exit, continue to the next exit. Never reverse, stop, or make a U-turn on the highway.'
      },
      {
        question: 'What is the penalty for texting while driving in California?',
        options: ['Warning only', 'Fine only', 'Fine and points on license', 'License suspension'],
        correctAnswer: 2,
        explanation: 'Texting while driving results in fines and points on your license. It is a primary offense in California.'
      },
      {
        question: 'When must you use your headlights?',
        options: ['Only at night', 'Half an hour after sunset to half an hour before sunrise', 'When visibility is less than 1000 feet', 'Both B and C'],
        correctAnswer: 3,
        explanation: 'You must use headlights from half an hour after sunset to half an hour before sunrise, and when visibility is less than 1000 feet.'
      },
      {
        question: 'What does a diamond-shaped sign indicate?',
        options: ['Stop ahead', 'Warning', 'Speed limit', 'No parking'],
        correctAnswer: 1,
        explanation: 'Diamond-shaped signs are warning signs that alert drivers to potential hazards ahead.'
      },
      {
        question: 'What should you do when approaching a school bus with flashing red lights?',
        options: ['Slow down and proceed', 'Stop and wait until lights stop flashing', 'Pass on the left', 'Honk and proceed'],
        correctAnswer: 1,
        explanation: 'You must stop when a school bus has flashing red lights and wait until they stop flashing before proceeding.'
      },
      {
        question: 'What is the speed limit in a residential area unless otherwise posted?',
        options: ['20 mph', '25 mph', '30 mph', '35 mph'],
        correctAnswer: 1,
        explanation: 'The speed limit in residential areas is typically 25 mph unless otherwise posted.'
      }
    ]
  },
  {
    title: 'Texas Practice Test - Road Signs & Safety',
    state: 'TX',
    category: 'practice',
    description: 'Practice test focusing on Texas road signs, traffic laws, and safe driving practices.',
    difficulty: 'medium',
    passingScore: 80,
    timeLimit: 35,
    questions: [
      {
        question: 'What does a red octagonal sign mean?',
        options: ['Yield', 'Stop', 'No entry', 'Wrong way'],
        correctAnswer: 1,
        explanation: 'A red octagonal sign is a stop sign, requiring a complete stop at the intersection.'
      },
      {
        question: 'What color are construction and work zone signs?',
        options: ['Red', 'Blue', 'Orange', 'Green'],
        correctAnswer: 2,
        explanation: 'Construction and work zone signs are typically orange to alert drivers to work areas.'
      },
      {
        question: 'What does a yellow diamond-shaped sign indicate?',
        options: ['Stop ahead', 'Warning', 'Speed limit', 'No parking'],
        correctAnswer: 1,
        explanation: 'Yellow diamond-shaped signs are warning signs indicating potential hazards ahead.'
      },
      {
        question: 'What is the legal blood alcohol limit for drivers in Texas?',
        options: ['0.05%', '0.08%', '0.10%', '0.15%'],
        correctAnswer: 1,
        explanation: 'The legal blood alcohol limit is 0.08% for drivers 21 and over in Texas.'
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
      },
      {
        question: 'What is the minimum following distance in good conditions?',
        options: ['1 second', '2 seconds', '3 seconds', '4 seconds'],
        correctAnswer: 2,
        explanation: 'Maintain at least a 3-second following distance in good weather conditions.'
      },
      {
        question: 'What does a solid white line on the road mean?',
        options: ['You may change lanes', 'Lane change discouraged', 'No lane changes allowed', 'Speed limit zone'],
        correctAnswer: 1,
        explanation: 'A solid white line indicates that lane changes are discouraged but not prohibited.'
      },
      {
        question: 'When parking on a hill facing downhill, which way should you turn your wheels?',
        options: ['Straight', 'Away from curb', 'Toward the curb', 'Does not matter'],
        correctAnswer: 2,
        explanation: 'When parking downhill, turn your wheels toward the curb to prevent the car from rolling.'
      },
      {
        question: 'What should you do when you see a flashing yellow light?',
        options: ['Stop', 'Proceed with caution', 'Speed up', 'Yield'],
        correctAnswer: 1,
        explanation: 'A flashing yellow light means proceed with caution. Slow down and be prepared to stop.'
      },
      {
        question: 'What is the penalty for texting while driving in Texas?',
        options: ['Warning', 'Fine only', 'Fine and points', 'License suspension'],
        correctAnswer: 2,
        explanation: 'Texting while driving in Texas results in fines and points on your license.'
      },
      {
        question: 'When must you use your headlights in Texas?',
        options: ['Only at night', 'Half hour after sunset to half hour before sunrise', 'When visibility is less than 1000 feet', 'Both B and C'],
        correctAnswer: 3,
        explanation: 'You must use headlights from half hour after sunset to half hour before sunrise, and when visibility is less than 1000 feet.'
      },
      {
        question: 'What should you do when approaching a school bus with flashing red lights?',
        options: ['Slow down', 'Stop and wait', 'Pass on the left', 'Honk'],
        correctAnswer: 1,
        explanation: 'You must stop when a school bus has flashing red lights and wait until they stop flashing.'
      },
      {
        question: 'What does a round sign with a red border mean?',
        options: ['Stop', 'Yield', 'No entry', 'Wrong way'],
        correctAnswer: 2,
        explanation: 'A round sign with a red border typically means no entry or prohibited action.'
      }
    ]
  },
  {
    title: 'Florida Mock Test - Complete Driver License Exam',
    state: 'FL',
    category: 'mock',
    description: 'Complete mock test simulating the actual Florida DMV driver license exam. Includes all major topics.',
    difficulty: 'hard',
    passingScore: 80,
    timeLimit: 45,
    questions: [
      {
        question: 'What is the legal blood alcohol limit for drivers 21 and over in Florida?',
        options: ['0.05%', '0.08%', '0.10%', '0.15%'],
        correctAnswer: 1,
        explanation: 'The legal blood alcohol limit is 0.08% for drivers 21 and over in Florida.'
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
      },
      {
        question: 'What is the minimum following distance in good conditions?',
        options: ['1 second', '2 seconds', '3 seconds', '4 seconds'],
        correctAnswer: 2,
        explanation: 'Maintain at least a 3-second following distance in good weather conditions.'
      },
      {
        question: 'What does a solid yellow line on your side of the road mean?',
        options: ['You may pass', 'No passing allowed', 'Pass with caution', 'Speed limit zone'],
        correctAnswer: 1,
        explanation: 'A solid yellow line on your side means no passing is allowed.'
      },
      {
        question: 'What is the penalty for texting while driving in Florida?',
        options: ['Warning', 'Fine only', 'Fine and points', 'License suspension'],
        correctAnswer: 2,
        explanation: 'Texting while driving in Florida results in fines and points on your license.'
      },
      {
        question: 'When must you use your headlights?',
        options: ['Only at night', 'Half hour after sunset to half hour before sunrise', 'When visibility is less than 1000 feet', 'Both B and C'],
        correctAnswer: 3,
        explanation: 'You must use headlights from half hour after sunset to half hour before sunrise, and when visibility is less than 1000 feet.'
      },
      {
        question: 'What should you do when approaching a school bus with flashing red lights?',
        options: ['Slow down', 'Stop and wait', 'Pass on the left', 'Honk'],
        correctAnswer: 1,
        explanation: 'You must stop when a school bus has flashing red lights and wait until they stop flashing.'
      },
      {
        question: 'What does a diamond-shaped sign indicate?',
        options: ['Stop ahead', 'Warning', 'Speed limit', 'No parking'],
        correctAnswer: 1,
        explanation: 'Diamond-shaped signs are warning signs indicating potential hazards ahead.'
      },
      {
        question: 'When parking on a hill, which way should you turn your wheels?',
        options: ['Straight', 'Away from curb when uphill', 'Toward curb when downhill', 'Both B and C'],
        correctAnswer: 3,
        explanation: 'Turn wheels away from curb when parking uphill, and toward curb when parking downhill.'
      },
      {
        question: 'What is the speed limit in a school zone in Florida?',
        options: ['15 mph', '20 mph', '25 mph', '30 mph'],
        correctAnswer: 1,
        explanation: 'The speed limit in school zones is typically 20 mph when children are present.'
      },
      {
        question: 'What should you do when you see a yellow traffic light?',
        options: ['Speed up', 'Stop if you can safely', 'Continue at same speed', 'Yield'],
        correctAnswer: 1,
        explanation: 'A yellow light means stop if you can do so safely. If not, proceed with caution.'
      },
      {
        question: 'What does a red traffic light mean?',
        options: ['Slow down', 'Stop completely', 'Proceed with caution', 'Yield'],
        correctAnswer: 1,
        explanation: 'A red traffic light means you must come to a complete stop.'
      },
      {
        question: 'When should you use your turn signals?',
        options: ['Only when changing lanes', 'At least 100 feet before turning', 'Only in heavy traffic', 'Never'],
        correctAnswer: 1,
        explanation: 'You should signal at least 100 feet before making a turn or changing lanes.'
      },
      {
        question: 'What is the speed limit in a residential area unless otherwise posted?',
        options: ['20 mph', '25 mph', '30 mph', '35 mph'],
        correctAnswer: 1,
        explanation: 'The speed limit in residential areas is typically 25 mph unless otherwise posted.'
      }
    ]
  },
  {
    title: 'New York Official Test Prep - Complete Exam',
    state: 'NY',
    category: 'official',
    description: 'Official test preparation covering all New York DMV requirements including traffic laws, signs, and safe driving practices.',
    difficulty: 'hard',
    passingScore: 80,
    timeLimit: 45,
    questions: [
      {
        question: 'What is the penalty for texting while driving in New York?',
        options: ['Warning', 'Fine only', 'Fine and points', 'License suspension'],
        correctAnswer: 2,
        explanation: 'Texting while driving in New York results in fines and points on your license.'
      },
      {
        question: 'When parking on a hill, which way should you turn your wheels?',
        options: ['Straight', 'Away from curb when uphill', 'Toward curb when downhill', 'Both B and C'],
        correctAnswer: 3,
        explanation: 'Turn wheels away from curb when parking uphill, and toward curb when parking downhill.'
      },
      {
        question: 'What is the minimum following distance in good conditions?',
        options: ['1 second', '2 seconds', '3 seconds', '4 seconds'],
        correctAnswer: 2,
        explanation: 'Maintain at least a 3-second following distance in good weather conditions.'
      },
      {
        question: 'What is the legal blood alcohol limit for drivers 21 and over in New York?',
        options: ['0.05%', '0.08%', '0.10%', '0.15%'],
        correctAnswer: 1,
        explanation: 'The legal blood alcohol limit is 0.08% for drivers 21 and over in New York.'
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
      },
      {
        question: 'What does a solid yellow line on your side of the road mean?',
        options: ['You may pass', 'No passing allowed', 'Pass with caution', 'Speed limit zone'],
        correctAnswer: 1,
        explanation: 'A solid yellow line on your side means no passing is allowed.'
      },
      {
        question: 'What is the speed limit in a school zone in New York?',
        options: ['15 mph', '20 mph', '25 mph', '30 mph'],
        correctAnswer: 1,
        explanation: 'The speed limit in school zones is typically 20 mph when children are present.'
      },
      {
        question: 'What should you do when you see a yellow traffic light?',
        options: ['Speed up', 'Stop if you can safely', 'Continue at same speed', 'Yield'],
        correctAnswer: 1,
        explanation: 'A yellow light means stop if you can do so safely. If not, proceed with caution.'
      },
      {
        question: 'What does a red traffic light mean?',
        options: ['Slow down', 'Stop completely', 'Proceed with caution', 'Yield'],
        correctAnswer: 1,
        explanation: 'A red traffic light means you must come to a complete stop.'
      },
      {
        question: 'When should you use your turn signals?',
        options: ['Only when changing lanes', 'At least 100 feet before turning', 'Only in heavy traffic', 'Never'],
        correctAnswer: 1,
        explanation: 'You should signal at least 100 feet before making a turn or changing lanes.'
      },
      {
        question: 'What is the speed limit in a residential area unless otherwise posted?',
        options: ['20 mph', '25 mph', '30 mph', '35 mph'],
        correctAnswer: 1,
        explanation: 'The speed limit in residential areas is typically 25 mph unless otherwise posted.'
      },
      {
        question: 'When must you use your headlights?',
        options: ['Only at night', 'Half hour after sunset to half hour before sunrise', 'When visibility is less than 1000 feet', 'Both B and C'],
        correctAnswer: 3,
        explanation: 'You must use headlights from half hour after sunset to half hour before sunrise, and when visibility is less than 1000 feet.'
      },
      {
        question: 'What should you do when approaching a school bus with flashing red lights?',
        options: ['Slow down', 'Stop and wait', 'Pass on the left', 'Honk'],
        correctAnswer: 1,
        explanation: 'You must stop when a school bus has flashing red lights and wait until they stop flashing.'
      },
      {
        question: 'What does a diamond-shaped sign indicate?',
        options: ['Stop ahead', 'Warning', 'Speed limit', 'No parking'],
        correctAnswer: 1,
        explanation: 'Diamond-shaped signs are warning signs indicating potential hazards ahead.'
      }
    ]
  }
];

// Sample Users
const sampleUsers = [
  {
    email: 'testuser@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    state: 'CA',
    role: 'user'
  },
  {
    email: 'admin@example.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    state: 'NY',
    role: 'admin'
  }
];

// Sample Appointments
const createSampleAppointments = async (users) => {
  const appointments = [];
  // Find any non-admin user (or use first user if no role field)
  const applicantUser = users.find(u => !u.role || u.role === 'user' || u.role !== 'admin') || users[0];
  
  if (applicantUser) {
    appointments.push(
      {
        user: applicantUser._id,
        state: 'CA',
        location: {
          name: 'Los Angeles DMV',
          address: '123 Main St',
          city: 'Los Angeles',
          zipCode: '90001'
        },
        appointmentType: 'written-test',
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        timeSlot: '10:00',
        status: 'scheduled',
        confirmationNumber: 'TEMP' // Will be replaced by pre-save hook
      },
      {
        user: applicantUser._id,
        state: 'CA',
        location: {
          name: 'San Francisco DMV',
          address: '456 Market St',
          city: 'San Francisco',
          zipCode: '94102'
        },
        appointmentType: 'road-test',
        scheduledDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        timeSlot: '14:30',
        status: 'scheduled',
        confirmationNumber: 'TEMP' // Will be replaced by pre-save hook
      }
    );
  }
  
  return appointments;
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/driver-license-platform');
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const initData = async () => {
  try {
    await connectDB();

    console.log('');
    console.log('========================================');
    console.log('  Initializing Comprehensive Sample Data');
    console.log('========================================');
    console.log('');

    // Clear existing data
    console.log('Clearing existing data...');
    await Test.deleteMany({});
    await User.deleteMany({});
    await Appointment.deleteMany({});
    console.log('✅ Existing data cleared');
    console.log('');

    // Insert Tests
    console.log('Inserting sample tests...');
    const insertedTests = await Test.insertMany(sampleTests);
    console.log(`✅ Inserted ${insertedTests.length} tests:`);
    sampleTests.forEach((test, index) => {
      console.log(`   ${index + 1}. ${test.title} (${test.questions.length} questions, ${test.state})`);
    });
    console.log('');

    // Create Users (with password hashing)
    console.log('Creating sample users...');
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      createdUsers.push(user);
      console.log(`✅ Created user: ${userData.email} (Password: ${userData.password})`);
    }
    console.log('');

    // Create Appointments
    console.log('Creating sample appointments...');
    const appointments = await createSampleAppointments(createdUsers);
    if (appointments.length > 0) {
      try {
        const createdAppointments = [];
        for (const apptData of appointments) {
          try {
            const appt = new Appointment(apptData);
            await appt.save(); // Save individually so pre-save hook runs
            createdAppointments.push(appt);
          } catch (err) {
            console.error(`   ❌ Error creating appointment: ${err.message}`);
          }
        }
        if (createdAppointments.length > 0) {
          console.log(`✅ Created ${createdAppointments.length} sample appointments`);
          createdAppointments.forEach((appt, index) => {
            console.log(`   ${index + 1}. ${appt.location.name} - ${appt.appointmentType} (${appt.confirmationNumber})`);
          });
        } else {
          console.log('⚠️  No appointments created (check errors above)');
        }
      } catch (err) {
        console.error(`❌ Error creating appointments: ${err.message}`);
      }
    } else {
      console.log('⚠️  No appointments to create (no user found)');
    }
    console.log('');

    console.log('========================================');
    console.log('  ✅ Sample Data Initialization Complete!');
    console.log('========================================');
    console.log('');
    console.log('Summary:');
    console.log(`  • Tests: ${insertedTests.length} (with ${sampleTests.reduce((sum, t) => sum + t.questions.length, 0)} total questions)`);
    console.log(`  • Users: ${createdUsers.length}`);
    console.log(`  • Appointments: ${appointments.length}`);
    console.log('');
    console.log('Test Accounts:');
    console.log('  • testuser@example.com / password123 (CA)');
    console.log('  • admin@example.com / admin123 (NY)');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing data:', error);
    process.exit(1);
  }
};

initData();

