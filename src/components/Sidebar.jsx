import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Icons } from './Icons';
import { useToast } from '../context/ToastContext';

export default function Sidebar() {
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const isVideoSection =
    location.pathname === '/video' ||
    location.pathname === '/prompt-to-video' ||
    location.pathname === '/image-to-video' ||
    location.pathname.startsWith('/video/');

  const handleDisabledClick = (menuName, icon = 'Sparkles') => {
    showToast(`${menuName} is coming soon. Only AI Video is currently active.`, icon);
  };

  return (
    <aside className="sidebar">
      <div>
        {/* AURQO Logo */}
        <button onClick={() => navigate('/video')} className="logo-link" title="AURQO AI Video">
          <Icons.Logo />
          <span className="brand-name">
            AURQO
            <span className="brand-dot"></span>
          </span>
        </button>

        {/* Complete Navigation Menu - AI Video is the Active Functional Module */}
        <nav className="nav-list">
          {/* Home */}
          <button
            type="button"
            onClick={() => handleDisabledClick('Home', 'Home')}
            className="nav-item nav-item-disabled"
            title="Only AI Video is active"
          >
            <Icons.Home />
            <span>Home</span>
          </button>

          {/* AI Chat */}
          <button
            type="button"
            onClick={() => handleDisabledClick('AI Chat', 'Chat')}
            className="nav-item nav-item-disabled"
            title="Only AI Video is active"
          >
            <Icons.Chat />
            <span>AI Chat</span>
          </button>

          {/* AI Code */}
          <button
            type="button"
            onClick={() => handleDisabledClick('AI Code', 'Code')}
            className="nav-item nav-item-disabled"
            title="Only AI Video is active"
          >
            <Icons.Code />
            <span>AI Code</span>
          </button>

          {/* AI Image */}
          <button
            type="button"
            onClick={() => handleDisabledClick('AI Image', 'Image')}
            className="nav-item nav-item-disabled"
            title="Only AI Video is active"
          >
            <Icons.Image />
            <span>AI Image</span>
          </button>

          {/* AI Video - THE MAIN ACTIVE & CLICKABLE ITEM */}
          <NavLink
            to="/video"
            className={`nav-item ${isVideoSection ? 'active' : ''}`}
            title="AI Video Studio (Active)"
          >
            <Icons.Video />
            <span>AI Video</span>
          </NavLink>

          {/* Submenu for AI Video: Prompt to Video & Image to Video */}
          <div className="nav-sub-list">
            <NavLink
              to="/prompt-to-video"
              className={({ isActive }) =>
                `nav-sub-item ${isActive ? 'active-sub' : ''}`
              }
            >
              <Icons.Sparkles />
              <span>Prompt to Video</span>
            </NavLink>
            <NavLink
              to="/image-to-video"
              className={({ isActive }) =>
                `nav-sub-item ${isActive ? 'active-sub' : ''}`
              }
            >
              <Icons.Image />
              <span>Image to Video</span>
            </NavLink>
          </div>

          {/* AI Learn */}
          <button
            type="button"
            onClick={() => handleDisabledClick('AI Learn', 'Learn')}
            className="nav-item nav-item-disabled"
            title="Only AI Video is active"
          >
            <Icons.Learn />
            <span>AI Learn</span>
          </button>

          {/* More Tools */}
          <button
            type="button"
            onClick={() => handleDisabledClick('More Tools', 'Tools')}
            className="nav-item nav-item-disabled"
            title="Only AI Video is active"
          >
            <Icons.Tools />
            <span>More Tools</span>
          </button>

          <hr className="nav-divider" />

          {/* History */}
          <button
            type="button"
            onClick={() => handleDisabledClick('History', 'History')}
            className="nav-item nav-item-disabled"
            title="Only AI Video is active"
          >
            <Icons.History />
            <span>History</span>
          </button>

          {/* Saved */}
          <button
            type="button"
            onClick={() => handleDisabledClick('Saved items', 'Bookmark')}
            className="nav-item nav-item-disabled"
            title="Only AI Video is active"
          >
            <Icons.Bookmark />
            <span>Saved</span>
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={() => handleDisabledClick('Settings', 'Settings')}
            className="nav-item nav-item-disabled"
            title="Only AI Video is active"
          >
            <Icons.Settings />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      {/* Bottom Group: Upgrade Card & User Profile */}
      <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Upgrade to Pro Card */}
        <div className="pro-card">
          <div className="pro-card-title">
            <span>Upgrade to Pro</span>
            <Icons.Sparkles />
          </div>
          <p className="pro-card-desc">Unlock 4K AI Video rendering, unlimited motion models & fast queue.</p>
          <button
            type="button"
            onClick={() => showToast('Redirecting to AURQO Pro Subscription...', 'Sparkles')}
            className="pro-card-btn"
          >
            Upgrade Now
          </button>
        </div>

        {/* User Profile Section */}
        <div className="user-profile">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="user-avatar">AR</div>
            <div className="user-name">Arjun R.</div>
          </div>
          <button
            type="button"
            onClick={() => showToast('User profile: Arjun R.', 'Check')}
            className="ctrl-btn"
            style={{ color: '#94a3b8' }}
            title="User Profile"
          >
            <Icons.ChevronDown />
          </button>
        </div>
      </div>
    </aside>
  );
}
