import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../components/Icons';
import GeneratingModal from '../components/GeneratingModal';
import VideoPlayer from '../components/VideoPlayer';
import { useToast } from '../context/ToastContext';

const generationStages = [
  { percent: 15, text: 'Analyzing image subject, depth map and keyframe vectors...' },
  { percent: 45, text: 'Synthesizing neural fluid dynamics and motion trails...' },
  { percent: 75, text: 'Rendering smooth high-definition temporal interpolation...' },
  { percent: 95, text: 'Applying lighting bloom and color grade...' },
  { percent: 100, text: 'Video generation completed!' }
];

// Sample images using high quality data URLs / SVG placeholders for instant preview
const sampleImages = [
  {
    name: 'Cyberpunk Portal',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230f172a"/><stop offset="50%" stop-color="%233b82f6"/><stop offset="100%" stop-color="%239333ea"/></linearGradient></defs><rect width="600" height="400" fill="url(%23g1)"/><circle cx="300" cy="200" r="90" fill="none" stroke="%2338bdf8" stroke-width="8"/><circle cx="300" cy="200" r="60" fill="none" stroke="%23f43f5e" stroke-width="6"/><text x="300" y="210" fill="white" font-family="sans-serif" font-weight="bold" font-size="22" text-anchor="middle">AURQO NEURAL</text></svg>'
  },
  {
    name: 'Neon Metropolis',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23020617"/><stop offset="50%" stop-color="%231e1b4b"/><stop offset="100%" stop-color="%23ec4899"/></linearGradient></defs><rect width="600" height="400" fill="url(%23g2)"/><rect x="80" y="140" width="80" height="260" fill="%230f172a"/><rect x="200" y="80" width="100" height="320" fill="%231e293b"/><rect x="340" y="160" width="90" height="240" fill="%230f172a"/><rect x="460" y="110" width="80" height="290" fill="%231e293b"/><text x="300" y="60" fill="%2338bdf8" font-family="sans-serif" font-weight="bold" font-size="20" text-anchor="middle">CYBER SKYLINE</text></svg>'
  }
];

export default function ImageToVideoPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [uploadedImage, setUploadedImage] = useState(sampleImages[0].url);
  const [imageFilename, setImageFilename] = useState('Cyberpunk Portal.svg');
  const [motionPrompt, setMotionPrompt] = useState('Slowly zoom toward the glowing neural portal while lights sweep smoothly.');
  const [imageMotion, setImageMotion] = useState('Medium');
  const [imageDuration, setImageDuration] = useState('10s'); // '5s' | '10s' | '15s'
  const [imageAspect, setImageAspect] = useState('16:9');
  const [isDragOver, setIsDragOver] = useState(false);

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');

  // Video Output State
  const [generatedVideo, setGeneratedVideo] = useState({
    hasGenerated: true,
    type: 'image',
    prompt: 'Slowly zoom toward the glowing neural portal while lights sweep smoothly.',
    aspectRatio: '16:9',
    style: 'Motion: Medium',
    duration: 10,
    uploadedImage: sampleImages[0].url,
    isSaved: false
  });

  const fileInputRef = useRef(null);
  const previewSectionRef = useRef(null);

  const handleFileUpload = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'Settings');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
      setImageFilename(file.name);
      showToast('Image uploaded successfully!', 'Check');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = () => {
    if (!uploadedImage) {
      showToast('Please upload or select an image first', 'Image');
      return;
    }

    const finalPrompt = motionPrompt.trim() || 'Slowly zoom toward the subject while the background moves naturally.';
    const finalDuration = parseInt(imageDuration, 10) || 10;

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
            type: 'image',
            prompt: finalPrompt,
            style: `Motion: ${imageMotion}`,
            aspectRatio: imageAspect,
            duration: finalDuration,
            uploadedImage: uploadedImage,
            isSaved: false
          });
          showToast(`Exact ${finalDuration}-Second animated video generated!`, 'Video');
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
            <h1 className="main-title">Image to Video</h1>
            <span className="version-badge">
              <Icons.Sparkles /> Motion Animator
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/prompt-to-video')}
            className="tool-btn"
            style={{ fontSize: '12px', padding: '6px 14px' }}
          >
            <Icons.Sparkles />
            <span>Switch to Prompt to Video</span>
          </button>
        </div>
        <p className="main-subtitle">
          Animate static images into realistic, dynamic video shots with camera motion and fluid dynamics.
        </p>
      </div>

      {/* Creation Form Card */}
      <div className="creation-card active-card" style={{ cursor: 'default' }}>
        <div className="card-top-accent accent-purple-pink"></div>

        <div>
          <div className="card-header">
            <div className="card-icon-box icon-box-purple">
              <Icons.Image />
            </div>
            <div>
              <h2 className="card-title">Image to Video Creation</h2>
              <p className="card-desc">
                Upload your picture and specify camera motions, pans, zooms, and environmental effects.
              </p>
            </div>
          </div>

          {/* Image Upload Dropzone */}
          <div className="form-group">
            <div className="form-label-row">
              <label>Upload Source Image</label>
              <span className="char-counter">PNG, JPG, WEBP, SVG</span>
            </div>

            <div
              onClick={() => {
                if (fileInputRef.current) fileInputRef.current.click();
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragOver(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className={`dropzone ${isDragOver ? 'drag-over' : ''}`}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
                style={{ display: 'none' }}
              />

              {!uploadedImage ? (
                <>
                  <div className="dropzone-icon">
                    <Icons.UploadCloud />
                  </div>
                  <p className="dropzone-text">
                    Drag & drop your image here or <span>browse</span>
                  </p>
                  <p className="dropzone-subtext">Supports PNG, JPG up to 20MB</p>
                </>
              ) : (
                <div className="uploaded-preview-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img src={uploadedImage} alt="Uploaded" className="preview-thumb-img" />
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ fontSize: '13.5px', fontWeight: '600', color: '#1e293b' }}>
                        {imageFilename || 'image.png'}
                      </p>
                      <span style={{ fontSize: '11px', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600', marginTop: '2px' }}>
                        <Icons.Check /> Ready for neural motion synthesis
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedImage(null);
                      setImageFilename('');
                      showToast('Image removed', 'Trash2');
                    }}
                    className="ctrl-btn"
                    style={{ color: '#94a3b8' }}
                    title="Remove image"
                  >
                    <Icons.Trash2 />
                  </button>
                </div>
              )}
            </div>

            {/* Sample Image Presets */}
            <div style={{ marginTop: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Or select a sample image:
              </span>
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                {sampleImages.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setUploadedImage(sample.url);
                      setImageFilename(sample.name + '.svg');
                      showToast(`Selected ${sample.name}`, 'Check');
                    }}
                    className="sample-image-btn"
                  >
                    <img src={sample.url} alt={sample.name} style={{ width: '32px', height: '24px', borderRadius: '4px', objectFit: 'cover' }} />
                    <span>{sample.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Motion Description Area */}
          <div className="form-group">
            <label htmlFor="motion-input" className="control-label">
              Motion & Camera Direction
            </label>
            <textarea
              id="motion-input"
              rows={2}
              value={motionPrompt}
              onChange={(e) => setMotionPrompt(e.target.value)}
              placeholder="Describe how you want the image to animate (e.g. Slow zoom forward, subtle lighting sweep, floating particles)"
              className="aurqo-textarea"
            />
          </div>

          {/* Controls: Motion, Duration & Aspect Ratio */}
          <div className="controls-grid-3">
            <div>
              <label className="control-label">Motion Intensity</label>
              <div className="pills-group pills-3">
                {['Low', 'Medium', 'High'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setImageMotion(lvl)}
                    className={`pill-btn ${imageMotion === lvl ? 'active' : ''}`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="control-label">
                Duration <span style={{ color: '#9333ea', fontSize: '11px', fontWeight: '700' }}>(Exact)</span>
              </label>
              <div className="pills-group pills-3">
                {['5s', '10s', '15s'].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setImageDuration(dur)}
                    className={`pill-btn ${imageDuration === dur ? 'active' : ''}`}
                    title={dur === '10s' ? '10 Seconds Exact Video Clip' : `${dur} Video`}
                  >
                    <Icons.Clock />
                    <span>{dur}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="control-label">Aspect Ratio</label>
              <div className="pills-group pills-3">
                {['16:9', '9:16', '1:1'].map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setImageAspect(ratio)}
                    className={`pill-btn ${imageAspect === ratio ? 'active' : ''}`}
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
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="button"
          disabled={isGenerating || !uploadedImage}
          onClick={handleGenerate}
          className="generate-btn"
        >
          <span>Generate Video ({imageDuration})</span>
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
        videoType="image"
        promptSummary={motionPrompt.trim() || 'Slowly zoom toward the subject with animated motion lighting.'}
        onCancel={() => {
          setIsGenerating(false);
          showToast('Generation cancelled', 'Trash2');
        }}
      />
    </div>
  );
}
