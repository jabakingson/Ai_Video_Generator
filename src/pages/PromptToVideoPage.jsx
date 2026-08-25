import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../components/Icons';
import GeneratingModal from '../components/GeneratingModal';
import VideoPlayer from '../components/VideoPlayer';
import { useToast } from '../context/ToastContext';

const generationStages = [
  { percent: 15, text: 'Analyzing text prompt semantics and spatial vectors...' },
  { percent: 42, text: 'Generating neural motion diffusion keyframes...' },
  { percent: 78, text: 'Rendering high-resolution cinematic frames...' },
  { percent: 96, text: 'Applying lighting consistency and color grading...' },
  { percent: 100, text: 'Video generation completed!' }
];

const samplePrompts = [
  'A futuristic cyberpunk city at night with flying cars, cinematic lighting, and neon rain reflections.',
  'Cinematic drone footage flying over misty alpine mountains during golden hour sunset.',
  'Close-up of a majestic glowing phoenix rising through sparkling volcanic embers in 8K.',
  'Hyperrealistic time-lapse of neon bioluminescent jellyfish drifting in deep underwater abyss.'
];

export default function PromptToVideoPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [promptText, setPromptText] = useState('');
  const [promptAspect, setPromptAspect] = useState('16:9');
  const [promptDuration, setPromptDuration] = useState('10s'); // '5s' | '10s' | '15s'
  const [promptStyle, setPromptStyle] = useState('Cinematic');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');

  // Generated Video state
  const [generatedVideo, setGeneratedVideo] = useState({
    hasGenerated: true,
    type: 'prompt',
    prompt: 'A futuristic city at night with flying cars, cinematic lighting, and rain.',
    aspectRatio: '16:9',
    style: 'Cinematic',
    duration: 10,
    isSaved: false
  });

  const previewSectionRef = useRef(null);

  const handleGenerate = () => {
    const finalPrompt = promptText.trim() || 'A futuristic city at night with flying cars, cinematic lighting, and rain.';
    const finalDuration = parseInt(promptDuration, 10) || 10;

    setIsGenerating(true);
    setProgressPercent(5);
    setProgressStatus(generationStages[0].text);

    let stageIdx = 0;
    const interval = setInterval(() => {
      stageIdx++;
      if (stageIdx < generationStages.length) {
        setProgressPercent(generationStages[stageIdx].percent);
        setProgressStatus(generationStages[stageIdx].text);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsGenerating(false);
          setGeneratedVideo({
            hasGenerated: true,
            type: 'prompt',
            prompt: finalPrompt,
            style: promptStyle,
            aspectRatio: promptAspect,
            duration: finalDuration,
            isSaved: false
          });
          showToast(`Exact ${finalDuration}-Second video generated successfully!`, 'Video');
          if (previewSectionRef.current) {
            previewSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 500);
      }
    }, 550);
  };

  const handleSaveToggle = () => {
    const next = !generatedVideo.isSaved;
    setGeneratedVideo((prev) => ({ ...prev, isSaved: next }));
    showToast(
      next ? 'Video saved to your collection!' : 'Video removed from collection',
      next ? 'BookmarkCheck' : 'Bookmark'
    );
  };

  return (
    <div className="view-container">
      {/* Top Header Row with Back Button */}
      <div className="page-heading">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="heading-row">
            <button
              type="button"
              onClick={() => navigate('/video')}
              className="icon-btn"
              title="Back to AI Video Hub"
              style={{ marginRight: '4px' }}
            >
              <Icons.ArrowLeft />
            </button>
            <h1 className="main-title">Prompt to Video</h1>
            <span className="version-badge">
              <Icons.Sparkles /> Dedicated Studio
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/image-to-video')}
            className="tool-btn"
            style={{ fontSize: '12px', padding: '6px 14px' }}
          >
            <Icons.Image />
            <span>Switch to Image to Video</span>
          </button>
        </div>
        <p className="main-subtitle">
          Transform text descriptions into high-fidelity AI generated video clips in seconds.
        </p>
      </div>

      {/* Creation Form Card */}
      <div className="creation-card active-card" style={{ cursor: 'default' }}>
        <div className="card-top-accent accent-blue-purple"></div>

        <div>
          <div className="card-header">
            <div className="card-icon-box icon-box-blue">
              <Icons.Sparkles />
            </div>
            <div>
              <h2 className="card-title">Prompt to Video Creation</h2>
              <p className="card-desc">
                Describe the scene, motion, atmosphere, and camera direction.
              </p>
            </div>
          </div>

          {/* Video Prompt Area */}
          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="prompt-input">Video Prompt</label>
              <span className="char-counter">{promptText.length}/500</span>
            </div>
            <textarea
              id="prompt-input"
              rows={4}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Describe the video you want to create... (e.g. A futuristic cyber city at dusk with glowing neon trails and flying vehicles)"
              className="aurqo-textarea"
            />

            {/* Prompt Suggestion Chips */}
            <div style={{ marginTop: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Sample Prompts:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                {samplePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPromptText(p)}
                    className="prompt-chip"
                  >
                    "{p.slice(0, 42)}..."
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Controls: Aspect Ratio, Duration & Style */}
          <div className="controls-grid-3">
            <div>
              <label className="control-label">Aspect Ratio</label>
              <div className="pills-group pills-3">
                {['16:9', '9:16', '1:1'].map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setPromptAspect(ratio)}
                    className={`pill-btn ${promptAspect === ratio ? 'active' : ''}`}
                  >
                    <span
                      className={
                        ratio === '16:9'
                          ? 'aspect-icon-169'
                          : ratio === '9:16'
                          ? 'aspect-icon-916'
                          : 'aspect-icon-11'
                      }
                    ></span>
                    <span>{ratio}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="control-label">
                Duration <span style={{ color: '#4f46e5', fontSize: '11px', fontWeight: '700' }}>(Exact)</span>
              </label>
              <div className="pills-group pills-3">
                {['5s', '10s', '15s'].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setPromptDuration(dur)}
                    className={`pill-btn ${promptDuration === dur ? 'active' : ''}`}
                    title={dur === '10s' ? '10 Seconds Exact Video Clip' : `${dur} Video`}
                  >
                    <Icons.Clock />
                    <span>{dur}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="control-label">Visual Style</label>
              <div className="pills-group pills-2">
                {['Cinematic', 'Realistic', 'Animation', '3D'].map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setPromptStyle(style)}
                    className={`pill-btn ${promptStyle === style ? 'active' : ''}`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="button"
          disabled={isGenerating}
          onClick={handleGenerate}
          className="generate-btn"
        >
          <span>Generate Video ({promptDuration})</span>
          <Icons.ArrowRight />
        </button>
      </div>

      {/* Video Preview Section */}
      <div ref={previewSectionRef}>
        <VideoPlayer
          video={generatedVideo}
          onRegenerate={handleGenerate}
          onSaveToggle={handleSaveToggle}
        />
      </div>

      {/* Background-Blurred Modal Popup during Video Generation */}
      <GeneratingModal
        isOpen={isGenerating}
        progressPercent={progressPercent}
        progressStatus={progressStatus}
        videoType="prompt"
        promptSummary={promptText.trim() || 'A futuristic city at night with flying cars, cinematic lighting, and rain.'}
        onCancel={() => {
          setIsGenerating(false);
          showToast('Generation cancelled', 'Trash2');
        }}
      />
    </div>
  );
}
