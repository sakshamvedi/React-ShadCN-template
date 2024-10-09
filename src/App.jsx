import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import RegistrationFlow from "./RegistrationFlow";
import Header from "./Header";
import MemberProfile from "./MemberProfile";
import Signin from './Signin';
import Signup from './Signup';
import PaymentPage from './PaymentPage';
import Profile from './Profile';
import UserProfile from './UserProfile';
import Event from './Events';
import EventShow from './EventsShow';
import EventDetails from './EventDetails';
import EventsDetailsUser from './EventsDetailsUser';
import { getUserData, isAuthenticated, logout } from './authUtils';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        setUser(getUserData());
      } else {
        setUser(null);
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <Router>
      <div>
        <Header user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/register" element={<RegistrationFlow />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/payments" element={<PaymentPage />} />
          <Route path="/events" element={<Event />} />
          <Route path="/eventlist" element={<EventShow />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/eventspart" element={<EventsDetailsUser />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home({ user }) {
  if (user) {
    return (
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
          <h1 className="text-2xl font-bold mb-6">Welcome, {user.displayName || user.email}</h1>
          <p className="mb-4">Explore our platform and manage your events.</p>
          <div className="space-y-2">
            <Link to="/profile" className="block w-full text-center bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">View Profile</Link>
            <Link to="/events" className="block w-full text-center bg-green-600 text-white p-2 rounded-md hover:bg-green-700">Manage Events</Link>
          </div>
        </div>
        <div className="hidden md:block w-1/2 p-8">
          <div className="flex h-full items-center justify-center">
            <img src="https://cdn.dribbble.com/users/23832/screenshots/17195867/media/b1e0a302b06138689185fbc5590d905c.jpg?resize=1000x750&vertical=center" alt="Welcome illustration" className="max-w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
        <h1 className="text-2xl font-bold mb-6">Welcome to Our Platform</h1>
        <p className="mb-4">Please sign in, sign up, or start the registration process.</p>
        <div className="space-y-2">
          <Link to="/signup" className="block w-full text-center bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">Register</Link>
          <Link to="/signin" className="block w-full text-center bg-green-600 text-white p-2 rounded-md hover:bg-green-700">Log In</Link>
        </div>
      </div>
      <div className="hidden md:block w-1/2 p-8">
        <div className="flex h-full items-center justify-center">
          <img src="https://cdn.dribbble.com/users/23832/screenshots/17195867/media/b1e0a302b06138689185fbc5590d905c.jpg?resize=1000x750&vertical=center" alt="Welcome illustration" className="max-w-full" />
        </div>
      </div>
    </div>
  );
}

export default App;