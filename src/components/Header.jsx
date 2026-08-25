import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Icons } from './Icons';
import { useToast } from '../context/ToastContext';

export default function Header() {
  const location = useLocation();
  const { showToast } = useToast();

  const getBreadcrumbs = () => {
    const path = location.pathname.toLowerCase();

    if (path === '/' || path === '/video') {
      return [{ label: 'AURQO AI Video', to: '/video' }, { label: 'Studio Hub' }];
    }
    if (path === '/prompt-to-video' || path === '/video/prompt-to-video' || path === '/video/prompt') {
      return [
        { label: 'AURQO AI Video', to: '/video' },
        { label: 'Prompt to Video' }
      ];
    }
    if (path === '/image-to-video' || path === '/video/image-to-video' || path === '/video/image') {
      return [
        { label: 'AURQO AI Video', to: '/video' },
        { label: 'Image to Video' }
      ];
    }
    if (path === '/history') {
      return [{ label: 'AURQO AI Video', to: '/video' }, { label: 'Generation History' }];
    }
    if (path === '/saved') {
      return [{ label: 'AURQO AI Video', to: '/video' }, { label: 'Saved Collection' }];
    }
    if (path === '/settings') {
      return [{ label: 'AURQO AI Video', to: '/video' }, { label: 'Settings' }];
    }

    const formatted = path.replace('/', '').replace(/-/g, ' ');
    return [
      { label: 'AURQO AI Video', to: '/video' },
      { label: formatted.charAt(0).toUpperCase() + formatted.slice(1) }
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="top-header">
      <div className="breadcrumbs">
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="breadcrumb-divider">/</span>}
              {crumb.to && !isLast ? (
                <Link to={crumb.to} className="breadcrumb-root breadcrumb-link">
                  {crumb.label}
                </Link>
              ) : (
                <span className={isLast ? 'breadcrumb-active' : 'breadcrumb-root'}>
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="header-actions">
        <button
          type="button"
          onClick={() => showToast('Light theme active (matching AURQO design)', 'Sun')}
          className="icon-btn"
          title="Toggle theme"
        >
          <Icons.Sun />
        </button>
        <button
          type="button"
          onClick={() => showToast('Sign In modal opened', 'Check')}
          className="sign-in-btn"
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => showToast('Welcome to AURQO Studio Pro!', 'Sparkles')}
          className="get-started-btn"
        >
          Get Started
        </button>
      </div>
    </header>
  );
}
