import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icons } from './Icons';
import { useToast } from '../context/ToastContext';

export default function VideoPlayer({
  video,
  onRegenerate,
  onSaveToggle
}) {
  const { showToast } = useToast();

  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackProgress, setPlaybackProgress] = useState(30); // 0 to 100%
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 0.5, 1, 1.5, 2
  const [isMuted, setIsMuted] = useState(true);
  const [isLooping, setIsLooping] = useState(true);

  // Video Export state
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Refs
  const canvasRef = useRef(null);
  const scrubberWrapRef = useRef(null);
  const isScrubbingRef = useRef(false);
  const playerContainerRef = useRef(null);
  const imageObjRef = useRef(null);

  // Load image if it's image-to-video
  useEffect(() => {
    if (video.type === 'image' && video.uploadedImage) {
      const img = new Image();
      img.src = video.uploadedImage;
      imageObjRef.current = img;
    }
  }, [video]);

  // Spacebar toggle playback
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real-time Canvas Neural Video Simulation (Exact timeline duration loop)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = 1280;
    const height = 720;
    canvas.width = width;
    canvas.height = height;

    const particles = [];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.8 + Math.random() * 2.2,
        size: 1 + Math.random() * 2.5,
        alpha: 0.3 + Math.random() * 0.7,
        color: ['#60a5fa', '#a78bfa', '#f472b6', '#38bdf8', '#c084fc'][Math.floor(Math.random() * 5)]
      });
    }

    const vehicles = [
      { x: 100, y: 350, speed: 2.5, color: '#38bdf8', trailLength: 90, yOffset: 0 },
      { x: 900, y: 420, speed: -2.0, color: '#f43f5e', trailLength: 70, yOffset: 1 },
      { x: 400, y: 280, speed: 3.4, color: '#818cf8', trailLength: 110, yOffset: 0.5 }
    ];

    let animationFrameId;
    let lastTime = performance.now();
    const totalDuration = video.duration || 10;

    function drawScene(now) {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying && !isScrubbingRef.current && delta > 0 && delta < 0.3) {
        setPlaybackProgress((prev) => {
          const step = ((delta * playbackSpeed) / totalDuration) * 100;
          let next = prev + step;
          if (next >= 100) {
            if (isLooping) {
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return next;
        });
      }

      const canvasTime = (playbackProgress / 100) * totalDuration;
      ctx.clearRect(0, 0, width, height);

      // RENDER IMAGE-TO-VIDEO ANIMATION
      if (video.type === 'image' && imageObjRef.current && imageObjRef.current.complete) {
        const img = imageObjRef.current;
        const norm = playbackProgress / 100;
        const scale = 1.04 + Math.sin(norm * Math.PI) * 0.12;
        const panX = Math.sin(norm * Math.PI * 2) * 20;
        const panY = Math.cos(norm * Math.PI * 2) * 10;

        ctx.save();
        ctx.translate(width / 2 + panX, height / 2 + panY);
        ctx.scale(scale, scale);

        const imgRatio = img.width / img.height;
        const canvasRatio = width / height;
        let dw, dh;
        if (imgRatio > canvasRatio) {
          dh = height;
          dw = height * imgRatio;
        } else {
          dw = width;
          dh = width / imgRatio;
        }
        ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
        ctx.restore();

        // Cinematic lighting sweep
        const sweepX = norm * (width + 600) - 300;
        const sweepGrad = ctx.createLinearGradient(sweepX - 160, 0, sweepX + 160, height);
        sweepGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        sweepGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.14)');
        sweepGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = sweepGrad;
        ctx.fillRect(0, 0, width, height);

        // Vignette
        const vigGrad = ctx.createRadialGradient(width / 2, height / 2, height * 0.35, width / 2, height / 2, width * 0.7);
        vigGrad.addColorStop(0, 'transparent');
        vigGrad.addColorStop(1, 'rgba(2, 6, 23, 0.65)');
        ctx.fillStyle = vigGrad;
        ctx.fillRect(0, 0, width, height);
      } else {
        // RENDER PROMPT-TO-VIDEO (Futuristic Neural Cyberpunk City)
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#070814');
        skyGrad.addColorStop(0.4, '#0f172a');
        skyGrad.addColorStop(1, '#1e1b4b');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        const glowGrad = ctx.createRadialGradient(width / 2, height * 0.75, 40, width / 2, height * 0.75, width * 0.65);
        glowGrad.addColorStop(0, 'rgba(124, 58, 237, 0.5)');
        glowGrad.addColorStop(0.35, 'rgba(59, 130, 246, 0.3)');
        glowGrad.addColorStop(0.7, 'rgba(236, 72, 153, 0.15)');
        glowGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, width, height);

        // Skyline
        ctx.fillStyle = '#0f172a';
        for (let i = 0; i < 24; i++) {
          const bx = i * 55;
          const bw = 48 + (i % 3) * 14;
          const bh = 220 + Math.sin(i * 1.5) * 80;
          ctx.fillRect(bx, height - bh, bw, bh);

          ctx.fillStyle = i % 2 === 0 ? 'rgba(147, 197, 253, 0.22)' : 'rgba(216, 180, 254, 0.22)';
          for (let wy = height - bh + 15; wy < height - 40; wy += 20) {
            for (let wx = bx + 6; wx < bx + bw - 6; wx += 12) {
              if (Math.sin(wx + wy + canvasTime * 0.8) > 0.15) {
                ctx.fillRect(wx, wy, 4, 6);
              }
            }
          }
          ctx.fillStyle = '#0f172a';
        }

        // Foreground High Rises
        for (let i = 0; i < 9; i++) {
          const bx = i * 150 - 30;
          const bw = 110;
          const bh = 340 + Math.cos(i * 2.2) * 120;

          const bGrad = ctx.createLinearGradient(bx, height - bh, bx + bw, height);
          bGrad.addColorStop(0, '#111827');
          bGrad.addColorStop(1, '#030712');
          ctx.fillStyle = bGrad;
          ctx.fillRect(bx, height - bh, bw, bh);

          ctx.strokeStyle = i % 2 === 0 ? '#38bdf8' : '#c084fc';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = i % 2 === 0 ? '#0284c7' : '#9333ea';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(bx, height - bh);
          ctx.lineTo(bx + bw, height - bh);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(bx + bw / 2, height - bh);
          ctx.lineTo(bx + bw / 2, height - bh - 40);
          ctx.stroke();

          const beaconAlpha = 0.5 + Math.sin(canvasTime * 3 + i) * 0.5;
          ctx.fillStyle = `rgba(239, 68, 68, ${beaconAlpha})`;
          ctx.beginPath();
          ctx.arc(bx + bw / 2, height - bh - 42, 3.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowBlur = 0;
        }

        // Vehicles
        vehicles.forEach((v) => {
          const currentX = ((v.x + canvasTime * v.speed * 80) % (width + 300)) - 100;
          const currentY = v.y + Math.sin(canvasTime * 2 + v.yOffset) * 14;

          const trailGrad = ctx.createLinearGradient(currentX, currentY, currentX - v.speed * v.trailLength * 0.5, currentY);
          trailGrad.addColorStop(0, v.color);
          trailGrad.addColorStop(1, 'transparent');
          ctx.strokeStyle = trailGrad;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(currentX, currentY);
          ctx.lineTo(currentX - v.speed * v.trailLength * 0.5, currentY);
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(currentX, currentY, 3.2, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Particles
      particles.forEach((p) => {
        const py = (p.y + canvasTime * p.speed * 120) % height;
        const px = (p.x + Math.sin(canvasTime + py * 0.01) * 20) % width;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // Camera HUD overlays
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      const bracketSize = 24;
      const margin = 32;

      ctx.beginPath();
      ctx.moveTo(margin, margin + bracketSize);
      ctx.lineTo(margin, margin);
      ctx.lineTo(margin + bracketSize, margin);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width - margin - bracketSize, margin);
      ctx.lineTo(width - margin, margin);
      ctx.lineTo(width - margin, margin + bracketSize);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(margin, height - margin - bracketSize);
      ctx.lineTo(margin, height - margin);
      ctx.lineTo(margin + bracketSize, height - margin);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width - margin - bracketSize, height - margin);
      ctx.lineTo(width - margin, height - margin);
      ctx.lineTo(width - margin, height - margin - bracketSize);
      ctx.stroke();

      const curSecInt = Math.min(totalDuration, Math.floor(canvasTime));
      const curDec = Math.floor((canvasTime % 1) * 10);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = '600 13px "Inter", monospace, sans-serif';
      ctx.fillText(`REC [${totalDuration}.0s] 00:0${curSecInt}.${curDec}`, width - margin - 150, margin + 20);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`AURQO AI Neural Motion • ${totalDuration}.0s HD`, margin + 10, height - margin - 12);

      animationFrameId = requestAnimationFrame(drawScene);
    }

    animationFrameId = requestAnimationFrame(drawScene);
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, playbackProgress, playbackSpeed, isLooping, video]);

  // Scrubbing & Seeking
  const handleScrubberSeek = useCallback((e) => {
    if (!scrubberWrapRef.current) return;
    const rect = scrubberWrapRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clickX = clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    setPlaybackProgress(ratio * 100);
  }, []);

  const handleScrubberMouseDown = (e) => {
    isScrubbingRef.current = true;
    handleScrubberSeek(e);

    const onMouseMove = (moveEvent) => {
      if (isScrubbingRef.current) handleScrubberSeek(moveEvent);
    };
    const onMouseUp = () => {
      isScrubbingRef.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleStepProgress = (deltaSeconds) => {
    const total = video.duration || 10;
    const deltaPercent = (deltaSeconds / total) * 100;
    setPlaybackProgress((prev) => Math.max(0, Math.min(100, prev + deltaPercent)));
  };

  const toggleSpeed = () => {
    const speeds = [0.5, 1, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
    showToast(`Playback speed: ${nextSpeed}x`, 'Play');
  };

  const formatTime = (secs) => {
    const clamped = Math.max(0, secs);
    const m = Math.floor(clamped / 60);
    const s = Math.floor(clamped % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Export Video
  const handleExportVideo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const durationSec = video.duration || 10;

    if (typeof MediaRecorder === 'undefined' || !canvas.captureStream) {
      showToast('Downloading snapshot frame...', 'Download');
      const link = document.createElement('a');
      link.download = `AURQO_AI_${durationSec}s_Video_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    showToast(`Recording exact ${durationSec}s HD video...`, 'Video');

    let mimeType = 'video/webm;codecs=vp9';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm;codecs=vp8';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = '';
      }
    }

    try {
      const stream = canvas.captureStream(30);
      const options = mimeType ? { mimeType } : {};
      const recorder = new MediaRecorder(stream, options);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType || 'video/webm' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `AURQO_AI_${durationSec}s_Video_${Date.now()}.webm`;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 1000);
        setIsExporting(false);
        setExportProgress(100);
        showToast(`Exact ${durationSec}-second video exported successfully!`, 'Check');
      };

      setPlaybackProgress(0);
      setPlaybackSpeed(1);
      setIsPlaying(true);
      recorder.start();

      const startTime = performance.now();
      const totalMs = durationSec * 1000;

      const progressInterval = setInterval(() => {
        const elapsed = performance.now() - startTime;
        const pct = Math.min(100, Math.round((elapsed / totalMs) * 100));
        setExportProgress(pct);

        if (elapsed >= totalMs) {
          clearInterval(progressInterval);
          if (recorder.state !== 'inactive') recorder.stop();
        }
      }, 100);
    } catch (err) {
      console.error('Export error:', err);
      setIsExporting(false);
      showToast('Export failed. Downloading snapshot instead.', 'Download');
      const link = document.createElement('a');
      link.download = `AURQO_AI_${durationSec}s_Video_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const handleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {
        showToast('Fullscreen not supported on this browser', 'Maximize');
      });
    } else {
      document.exitFullscreen();
    }
  };

  if (!video || !video.hasGenerated) return null;

  return (
    <section className="video-preview-section">
      <div className="preview-meta-row">
        <div className="preview-title-wrap">
          <div className="preview-title-row">
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
              Generated Video Output
            </h2>
            <span className="ready-badge">
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981' }}></span>
              Ready
            </span>
          </div>
          <p className="preview-prompt-text">"{video.prompt}"</p>
        </div>

        <div className="preview-tags-row">
          <span className="tag-badge tag-green">⏱️ {video.duration || 10}s Exact Clip</span>
          <span className="tag-badge tag-gray">{video.aspectRatio}</span>
          <span className="tag-badge tag-indigo">{video.style}</span>
        </div>
      </div>

      {/* Video Canvas Player Container with Complete Playback Controls */}
      <div
        ref={playerContainerRef}
        className={`video-canvas-container ${
          video.aspectRatio === '16:9'
            ? 'aspect-16-9'
            : video.aspectRatio === '1:1'
            ? 'aspect-1-1'
            : 'aspect-9-16'
        }`}
      >
        <canvas
          ref={canvasRef}
          onClick={() => setIsPlaying((prev) => !prev)}
          className="canvas-player"
          title="Click video to toggle playback"
        ></canvas>

        {/* Top HUD Badge */}
        <div className="video-hud-badge">
          <span className="ping-dot"></span>
          <span>AI VIDEO • EXACT {video.duration || 10}.0s</span>
        </div>

        {/* Center Play Button Overlay (when paused) */}
        {!isPlaying && !isExporting && (
          <div
            onClick={() => setIsPlaying(true)}
            className="center-play-btn-box"
            title="Play video"
          >
            <button className="center-play-circle">
              <Icons.Play />
            </button>
          </div>
        )}

        {/* Exporting Overlay */}
        {isExporting && (
          <div className="export-overlay">
            <div className="progress-spinner" style={{ width: '38px', height: '38px' }}>
              <Icons.Loader />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '3px' }}>
                Recording & Exporting {video.duration || 10}-Second Video
              </h3>
              <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                Capturing high-frame-rate canvas animation ({exportProgress}%)
              </p>
            </div>
            <div className="export-progress-bar">
              <div className="export-progress-fill" style={{ width: `${exportProgress}%` }}></div>
            </div>
          </div>
        )}

        {/* Video Controls Overlay */}
        <div className="video-controls-overlay">
          {/* Scrubbable Interactive Progress Bar */}
          <div
            ref={scrubberWrapRef}
            className="scrubber-wrap"
            onMouseDown={handleScrubberMouseDown}
            onTouchStart={handleScrubberSeek}
            onTouchMove={handleScrubberSeek}
            title="Click or drag to scrub video playback"
          >
            <div className="video-scrubber-track">
              <div
                className="video-scrubber-fill"
                style={{ width: `${playbackProgress}%` }}
              >
                <div className="scrubber-thumb"></div>
              </div>
            </div>
          </div>

          {/* Bottom Controls Bar */}
          <div className="video-controls-buttons">
            {/* Left: Playback Controls & Timecode */}
            <div className="ctrl-btn-group">
              <button
                onClick={() => setIsPlaying((prev) => !prev)}
                className="ctrl-btn"
                title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
              >
                {isPlaying ? <Icons.Pause /> : <Icons.Play />}
              </button>

              <button
                onClick={() => handleStepProgress(-1)}
                className="ctrl-btn"
                title="Step Back 1s"
              >
                <Icons.SkipBack />
              </button>

              <button
                onClick={() => handleStepProgress(1)}
                className="ctrl-btn"
                title="Step Forward 1s"
              >
                <Icons.SkipForward />
              </button>

              {/* Live Video Timecode Display */}
              <div className="video-time-display" title="Live Video Timecode">
                <Icons.Clock />
                <span>{formatTime((playbackProgress / 100) * (video.duration || 10))}</span>
                <span style={{ opacity: 0.4 }}>/</span>
                <span>{formatTime(video.duration || 10)}</span>
              </div>

              <button
                onClick={() => {
                  setIsMuted((prev) => !prev);
                  showToast(isMuted ? 'Audio unmuted' : 'Muted', 'Volume2');
                }}
                className="ctrl-btn"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <Icons.VolumeX /> : <Icons.Volume2 />}
              </button>

              <button
                onClick={() => {
                  setIsLooping((prev) => !prev);
                  showToast(isLooping ? 'Looping disabled' : 'Looping enabled', 'Repeat');
                }}
                className={`ctrl-btn ${isLooping ? 'active-state' : ''}`}
                title="Toggle Loop"
              >
                <Icons.Repeat />
              </button>
            </div>

            {/* Right: Engine Tag, Speed Selector, Fullscreen */}
            <div className="ctrl-btn-group">
              <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', fontWeight: '500', marginRight: '6px' }}>
                AURQO Neural Engine
              </span>

              <button
                onClick={toggleSpeed}
                className="speed-pill-btn"
                title="Change Playback Speed"
              >
                {playbackSpeed}x
              </button>

              <button
                onClick={handleFullscreen}
                className="ctrl-btn"
                title="Toggle Fullscreen"
              >
                <Icons.Maximize />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar Buttons */}
      <div className="preview-toolbar">
        <div className="toolbar-group">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="tool-btn"
            >
              <Icons.RotateCw />
              <span>Regenerate</span>
            </button>
          )}

          <button
            onClick={onSaveToggle}
            className={`tool-btn ${video.isSaved ? 'saved-active' : ''}`}
          >
            {video.isSaved ? <Icons.BookmarkCheck /> : <Icons.Bookmark />}
            <span>{video.isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              showToast('Share link copied to clipboard!', 'Share2');
            }}
            className="tool-btn"
          >
            <Icons.Share2 />
            <span>Share</span>
          </button>
        </div>

        <button
          disabled={isExporting}
          onClick={handleExportVideo}
          className="download-mp4-btn"
          title={`Export and download exact ${video.duration || 10}-second video clip`}
        >
          <Icons.Download />
          <span>
            {isExporting
              ? `Exporting (${exportProgress}%)...`
              : `Download ${video.duration || 10}s Video`}
          </span>
        </button>
      </div>
    </section>
  );
}
