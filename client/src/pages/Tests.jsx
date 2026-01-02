/**
 * Tests Page - Test listing with search, filtering, and progress tracking
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import axios from 'axios';
import { Search, Filter, Play, CheckCircle, XCircle, Clock } from 'lucide-react';

const Tests = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [testHistory, setTestHistory] = useState([]);

  useEffect(() => {
    fetchTests();
    fetchTestHistory();
  }, []);

  useEffect(() => {
    filterTests();
  }, [searchTerm, categoryFilter, difficultyFilter, tests]);

  const fetchTests = async () => {
    try {
      const response = await axios.get(`/api/tests/state/${user?.state}`);
      setTests(response.data);
      setFilteredTests(response.data);
    } catch (error) {
      console.error('Fetch tests error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestHistory = async () => {
    try {
      const response = await axios.get('/api/tests/user/history');
      setTestHistory(response.data.testScores || []);
    } catch (error) {
      console.error('Fetch test history error:', error);
    }
  };

  const filterTests = () => {
    let filtered = [...tests];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(test =>
        test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(test => test.category === categoryFilter);
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(test => test.difficulty === difficultyFilter);
    }

    setFilteredTests(filtered);
  };

  const getTestStatus = (testId) => {
    const history = testHistory.find(h => h.testId?._id === testId || h.testId === testId);
    if (!history) return null;
    return {
      score: history.score,
      passed: history.passed,
      completedAt: history.completedAt
    };
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

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Tests</h1>
          <p className="text-gray-600">Practice tests for {user?.state}</p>
        </div>

        {/* Search and Filters */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tests..."
                  className="form-input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <select
                className="form-input"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="practice">Practice</option>
                <option value="mock">Mock</option>
                <option value="official">Official</option>
              </select>
            </div>
            <div>
              <select
                className="form-input"
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tests Grid */}
        {filteredTests.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600">No tests found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => {
              const status = getTestStatus(test._id);
              return (
                <div key={test._id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{test.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {test.category}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          {test.difficulty}
                        </span>
                      </div>
                    </div>
                    {status && (
                      status.passed ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-600" />
                      )
                    )}
                  </div>

                  {test.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{test.description}</p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {test.timeLimit} min
                    </div>
                    <div>{test.questions.length} questions</div>
                  </div>

                  {status && (
                    <div className="mb-4 p-3 bg-gray-50 rounded">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Last Score:</span>
                        <span className={`font-semibold ${status.passed ? 'text-green-600' : 'text-red-600'}`}>
                          {status.score}% {status.passed ? '✓' : '✗'}
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => navigate(`/test/${test._id}`)}
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {status ? 'Retake Test' : 'Start Test'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Tests;


