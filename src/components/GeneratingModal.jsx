import React from 'react';
import { Icons } from './Icons';

export default function GeneratingModal({
  isOpen,
  progressPercent,
  progressStatus,
  videoType,
  promptSummary,
  onCancel
}) {
  if (!isOpen) return null;

  return (
    <div className="generating-modal-backdrop" onClick={(e) => e.stopPropagation()}>
      <div className="generating-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Top Decorative Glow bar */}
        <div className="card-top-accent accent-blue-purple"></div>

        {/* Header with animated spinner */}
        <div className="modal-header-section">
          <div className="modal-spinner-wrapper">
            <div className="modal-spinner-ring"></div>
            <div className="modal-spinner-icon">
              <Icons.Loader />
            </div>
          </div>

          <div className="modal-title-group">
            <div className="modal-badge-row">
              <span className="modal-pill-tag">
                <Icons.Sparkles /> AURQO Neural Engine
              </span>
              <span className="modal-percent-badge">{progressPercent}%</span>
            </div>
            <h2 className="modal-heading">Generating Video...</h2>
            <p className="modal-subheading">
              {videoType === 'image' ? 'Image-to-Video Synthesis' : 'Prompt-to-Video Generation'}
            </p>
          </div>
        </div>

        {/* Active Stage info */}
        <div className="modal-stage-box">
          <div className="stage-pulse-dot"></div>
          <div className="stage-text-wrap">
            <span className="stage-label">Current Stage</span>
            <p className="stage-description">{progressStatus || 'Synthesizing neural keyframes...'}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="modal-progress-bar-wrap">
          <div className="modal-progress-track">
            <div
              className="modal-progress-fill"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="progress-glow-point"></div>
            </div>
          </div>
          <div className="modal-progress-footer">
            <span>0%</span>
            <span className="est-time-text">
              {progressPercent < 100 ? 'Rendering frames...' : 'Finalizing clip!'}
            </span>
            <span>100%</span>
          </div>
        </div>

        {/* Prompt Preview Snippet */}
        {promptSummary && (
          <div className="modal-prompt-snippet">
            <span className="snippet-label">Prompt:</span>
            <span className="snippet-text">"{promptSummary}"</span>
          </div>
        )}

        {/* Cancel Button */}
        {onCancel && progressPercent < 100 && (
          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="modal-cancel-btn">
              Cancel Generation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
