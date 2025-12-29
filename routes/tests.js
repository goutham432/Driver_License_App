/**
 * Test Routes
 * Handles test retrieval and submission
 */

const express = require('express');
const Test = require('../models/Test');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tests/state/:state
// @desc    Get all tests for a specific state (without answers)
// @access  Public
router.get('/state/:state', async (req, res) => {
  try {
    const { state } = req.params;
    
    if (!['CA', 'TX', 'FL', 'NY'].includes(state)) {
      return res.status(400).json({ message: 'Invalid state code' });
    }

    const tests = await Test.find({ 
      state, 
      isActive: true 
    }).select('-questions.correctAnswer');

    res.json(tests);
  } catch (error) {
    console.error('Get tests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tests/:testId
// @desc    Get specific test (without answers)
// @access  Public
router.get('/:testId', async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId).select('-questions.correctAnswer');
    
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    res.json(test);
  } catch (error) {
    console.error('Get test error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tests/:testId/submit
// @desc    Submit test answers and get results
// @access  Private
router.post('/:testId/submit', auth, async (req, res) => {
  try {
    const { answers } = req.body; // Array of { questionIndex, selectedAnswer }
    const test = await Test.findById(req.params.testId);

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    // Calculate score
    let correctCount = 0;
    const detailedAnswers = test.questions.map((question, index) => {
      const userAnswer = answers.find(a => a.questionIndex === index);
      const selectedAnswer = userAnswer ? userAnswer.selectedAnswer : -1;
      const isCorrect = selectedAnswer === question.correctAnswer;
      
      if (isCorrect) correctCount++;
      
      return {
        questionIndex: index,
        question: question.question,
        options: question.options,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      };
    });

    const score = Math.round((correctCount / test.questions.length) * 100);
    const passed = score >= test.passingScore;

    // Save test score to user
    const user = await User.findById(req.user._id);
    user.testScores.push({
      testId: test._id,
      score,
      passed,
      answers: detailedAnswers.map(a => ({
        questionIndex: a.questionIndex,
        selectedAnswer: a.selectedAnswer,
        isCorrect: a.isCorrect
      }))
    });
    await user.save();

    res.json({
      score,
      passed,
      passingScore: test.passingScore,
      totalQuestions: test.questions.length,
      correctAnswers: correctCount,
      answers: detailedAnswers
    });
  } catch (error) {
    console.error('Submit test error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tests/user/history
// @desc    Get user's test history
// @access  Private
router.get('/user/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('testScores.testId', 'title state category difficulty');
    
    res.json({
      testScores: user.testScores,
      totalTests: user.testScores.length,
      passedTests: user.testScores.filter(ts => ts.passed).length,
      averageScore: user.testScores.length > 0
        ? Math.round(user.testScores.reduce((sum, ts) => sum + ts.score, 0) / user.testScores.length)
        : 0
    });
  } catch (error) {
    console.error('Get test history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

