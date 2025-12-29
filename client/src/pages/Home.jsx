/**
 * Home Page - Landing page with features and call-to-action
 */

import { Link } from 'react-router-dom';
import { FileText, Calendar, Award, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: FileText,
      title: 'Practice Tests',
      description: 'Take practice tests for CA, TX, FL, and NY with real DMV questions'
    },
    {
      icon: Calendar,
      title: 'Book Appointments',
      description: 'Schedule your DMV appointments online with real-time availability'
    },
    {
      icon: Award,
      title: 'Track Progress',
      description: 'Monitor your test scores and improve with detailed analytics'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Your data is protected with industry-standard security measures'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Prepare for Your Driver License Test
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Practice tests and DMV appointment booking for California, Texas, Florida, and New York
            </p>
            {!isAuthenticated && (
              <div className="flex justify-center space-x-4">
                <Link to="/register" className="btn-primary bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Succeed</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card text-center">
                  <Icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* States Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Available in Multiple States</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['CA', 'TX', 'FL', 'NY'].map((state) => (
              <div key={state} className="card text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{state}</div>
                <div className="text-gray-600">
                  {state === 'CA' && 'California'}
                  {state === 'TX' && 'Texas'}
                  {state === 'FL' && 'Florida'}
                  {state === 'NY' && 'New York'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="bg-blue-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of users preparing for their driver license test
            </p>
            <Link to="/register" className="btn-primary bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3 inline-flex items-center">
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;

