/**
 * Main App Component
 * Sets up routing and authentication context
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tests from './pages/Tests';
import TestTaking from './pages/TestTaking';
import Appointments from './pages/Appointments';
import BookAppointment from './pages/BookAppointment';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/test/:testId" element={<TestTaking />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;


