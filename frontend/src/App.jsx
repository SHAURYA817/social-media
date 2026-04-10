import React from 'react'
import { Routes, Route, Navigate } from "react-router";

import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import NotificationPage from './pages/NotificationPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import CallPage from './pages/CallPage.jsx';
import ChatPage from './pages/ChatPage.jsx';
import HomePage from './pages/HomePage.jsx';

import { Toaster } from 'react-hot-toast';

import { useQuery } from '@tanstack/react-query';

import {axiosInstance} from './lib/axios.js';

const App = () => {
  // tankstack query
  const {data:authData, isLoading, error} = useQuery({
    queryKey: ['authUser'],

    queryFn: async () => {
      const res = await axiosInstance.get('/auth/me');
      return res.data;
    },
    retry: false, // to prevent retrying the request on failure 
  })
  
  const authUser = authData?.user;


  return <div className="h-screen" data-theme="coffee">
    <Routes>
      <Route path="/" element={authUser ? <HomePage /> : <Navigate to ="/login"/>} />
      <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/"/>} />
      <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/"/>} />
      <Route path="/notifications" element={authUser ? <NotificationPage /> : <Navigate to="/login"/>} />
      <Route path="/onboarding" element={authUser ? <OnboardingPage /> : <Navigate to="/login"/>} />
      <Route path="/call" element={authUser ? <CallPage /> : <Navigate to="/login"/>} />
      <Route path="/chat" element={authUser ? <ChatPage /> : <Navigate to="/login"/>} />

    </Routes>

    <Toaster />

</div>
}

export default App
