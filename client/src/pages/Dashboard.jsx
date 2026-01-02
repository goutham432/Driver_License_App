/**
 * Dashboard Page - User overview with statistics and quick actions
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import axios from 'axios';
import { FileText, Calendar, TrendingUp, Award, ArrowRight, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTests: 0,
    passedTests: 0,
    averageScore: 0,
    upcomingAppointments: 0
  });
  const [recentTests, setRecentTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [testHistory, appointments] = await Promise.all([
        axios.get('/api/tests/user/history'),
        axios.get('/api/appointments/my-appointments')
      ]);

      const history = testHistory.data;
      const upcoming = appointments.data.appointments.filter(apt => 
        new Date(apt.scheduledDate) >= new Date() && 
        apt.status !== 'cancelled'
      );

      setStats({
        totalTests: history.totalTests || 0,
        passedTests: history.passedTests || 0,
        averageScore: history.averageScore || 0,
        upcomingAppointments: upcoming.length
      });

      setRecentTests(history.testScores?.slice(0, 5) || []);
    } catch (error) {
      console.error('Fetch dashboard error:', error);
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your progress for {user?.state}
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tests Completed</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalTests}</p>
              </div>
              <FileText className="h-12 w-12 text-blue-600" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tests Passed</p>
                <p className="text-3xl font-bold text-green-600">{stats.passedTests}</p>
              </div>
              <Award className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-3xl font-bold text-gray-900">{stats.averageScore}%</p>
              </div>
              <TrendingUp className="h-12 w-12 text-purple-600" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming Appointments</p>
                <p className="text-3xl font-bold text-gray-900">{stats.upcomingAppointments}</p>
              </div>
              <Calendar className="h-12 w-12 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link to="/tests" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Take Practice Test</h3>
                <p className="text-gray-600">Start practicing for your driver license test</p>
              </div>
              <ArrowRight className="h-8 w-8 text-blue-600" />
            </div>
          </Link>

          <Link to="/book-appointment" className="card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Book Appointment</h3>
                <p className="text-gray-600">Schedule your DMV appointment online</p>
              </div>
              <ArrowRight className="h-8 w-8 text-blue-600" />
            </div>
          </Link>
        </div>

        {/* Recent Test Results */}
        {recentTests.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Recent Test Results</h2>
            <div className="space-y-4">
              {recentTests.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                      test.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {test.passed ? <Award className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                    </div>
                    <div>
                      <p className="font-medium">
                        {test.testId?.title || 'Practice Test'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(test.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${test.passed ? 'text-green-600' : 'text-red-600'}`}>
                      {test.score}%
                    </p>
                    <p className="text-sm text-gray-600">
                      {test.passed ? 'Passed' : 'Failed'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/tests" className="block text-center mt-4 text-blue-600 hover:text-blue-700">
              View All Tests →
            </Link>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;


