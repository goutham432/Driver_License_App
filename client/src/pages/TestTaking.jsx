/**
 * Test Taking Page - Interactive test interface with timer and navigation
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import axios from 'axios';
import { Clock, ChevronLeft, ChevronRight, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const TestTaking = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchTest();
  }, [testId]);

  useEffect(() => {
    if (test && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [test, timeRemaining]);

  const fetchTest = async () => {
    try {
      const response = await axios.get(`/api/tests/${testId}`);
      setTest(response.data);
      setTimeRemaining(response.data.timeLimit * 60); // Convert to seconds
      setAnswers(new Array(response.data.questions.length).fill(null));
    } catch (error) {
      console.error('Fetch test error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;

    const unanswered = answers.filter(a => a === null).length;
    if (unanswered > 0 && !showConfirm) {
      setShowConfirm(true);
      return;
    }

    setSubmitting(true);
    setShowConfirm(false);

    try {
      const answerData = answers.map((answer, index) => ({
        questionIndex: index,
        selectedAnswer: answer !== null ? answer : -1
      }));

      const response = await axios.post(`/api/tests/${testId}/submit`, { answers: answerData });
      navigate('/tests', { state: { results: response.data } });
    } catch (error) {
      console.error('Submit test error:', error);
      alert('Error submitting test. Please try again.');
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeRemaining < 300) return 'text-red-600'; // Less than 5 minutes
    if (timeRemaining < 600) return 'text-orange-600'; // Less than 10 minutes
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!test) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <p className="text-gray-600">Test not found</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const question = test.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / test.questions.length) * 100;
  const answeredCount = answers.filter(a => a !== null).length;

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{test.title}</h1>
              <p className="text-gray-600">Question {currentQuestion + 1} of {test.questions.length}</p>
            </div>
            <div className={`text-2xl font-bold ${getTimeColor()}`}>
              <Clock className="h-6 w-6 inline mr-2" />
              {formatTime(timeRemaining)}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{answeredCount} of {test.questions.length} answered</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
        </div>

        {/* Question Navigation */}
        <div className="card mb-6">
          <div className="flex flex-wrap gap-2">
            {test.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded ${
                  index === currentQuestion
                    ? 'bg-blue-600 text-white'
                    : answers[index] !== null
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-6">{question.question}</h2>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion, index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  answers[currentQuestion] === index
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                  <span>{option}</span>
                  {answers[currentQuestion] === index && (
                    <CheckCircle className="h-5 w-5 text-blue-600 ml-auto" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </button>

          {currentQuestion < test.questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="btn-primary flex items-center"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary flex items-center"
            >
              {submitting ? 'Submitting...' : 'Submit Test'}
            </button>
          )}
        </div>

        {/* Confirmation Dialog */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-xl font-semibold mb-4">Confirm Submission</h3>
              <p className="text-gray-600 mb-4">
                You have {answers.filter(a => a === null).length} unanswered questions. Are you sure you want to submit?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="btn-secondary flex-1"
                >
                  Go Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="btn-primary flex-1"
                >
                  Submit Anyway
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default TestTaking;


