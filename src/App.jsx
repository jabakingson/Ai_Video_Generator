import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import VideoHubPage from './pages/VideoHubPage';
import PromptToVideoPage from './pages/PromptToVideoPage';
import ImageToVideoPage from './pages/ImageToVideoPage';
import HistoryPage from './pages/HistoryPage';
import SavedPage from './pages/SavedPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

export default function App() {
  return (
    <div className="app-container">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Right Content Area */}
      <main className="main-content">
        {/* Persistent Top Header with Breadcrumbs & Actions */}
        <Header />

        {/* Dynamic Route Pages */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            {/* Default root opens AI Video Hub directly */}
            <Route path="/" element={<Navigate to="/video" replace />} />
            <Route path="/home" element={<Navigate to="/video" replace />} />

            {/* AI Video Main Hub & Dedicated Pages */}
            <Route path="/video" element={<VideoHubPage />} />
            <Route path="/prompt-to-video" element={<PromptToVideoPage />} />
            <Route path="/video/prompt-to-video" element={<PromptToVideoPage />} />
            <Route path="/video/prompt" element={<PromptToVideoPage />} />

            <Route path="/image-to-video" element={<ImageToVideoPage />} />
            <Route path="/video/image-to-video" element={<ImageToVideoPage />} />
            <Route path="/video/image" element={<ImageToVideoPage />} />

            {/* AI Video Management */}
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/settings" element={<SettingsPage />} />

            {/* Fallback to /video */}
            <Route path="*" element={<Navigate to="/video" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
