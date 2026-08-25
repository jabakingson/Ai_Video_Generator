import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../components/Icons';
import { useToast } from '../context/ToastContext';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const historyItems = [
    {
      id: 'gen-1',
      title: 'A futuristic city at night with flying cars, cinematic lighting, and rain.',
      type: 'Prompt to Video',
      duration: '10s',
      aspect: '16:9',
      date: 'Just now',
      route: '/prompt-to-video'
    },
    {
      id: 'gen-2',
      title: 'Slow zoom toward glowing neural portal with ambient light sweep',
      type: 'Image to Video',
      duration: '10s',
      aspect: '16:9',
      date: '2 hours ago',
      route: '/image-to-video'
    },
    {
      id: 'gen-3',
      title: 'Cyberpunk street samurai under neon rain in Tokyo 2099',
      type: 'AI Image',
      duration: 'Snapshot',
      aspect: '1:1',
      date: 'Yesterday',
      route: '/image'
    }
  ];

  return (
    <div className="view-container">
      <div className="page-heading">
        <div className="heading-row">
          <h1 className="main-title">Generation History</h1>
          <span className="version-badge"><Icons.History /> Cloud Sync</span>
        </div>
        <p className="main-subtitle">View and re-open all your past generated videos, prompts, and media.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {historyItems.map((item) => (
          <div
            key={item.id}
            className="creation-card"
            style={{ padding: '20px', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="card-icon-box icon-box-blue" style={{ width: '42px', height: '42px' }}>
                <Icons.Video />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span className="tag-badge tag-indigo">{item.type}</span>
                  <span className="tag-badge tag-green">{item.duration}</span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{item.date}</span>
                </div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                  "{item.title}"
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => navigate(item.route)}
                className="tool-btn"
                style={{ fontSize: '12px', padding: '8px 14px' }}
              >
                <span>Open in Studio</span>
                <Icons.ArrowRight />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
