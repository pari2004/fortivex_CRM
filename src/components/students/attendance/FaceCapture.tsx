'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, CheckCircle, AlertTriangle, ShieldCheck, CameraOff, Users, ZoomIn, Maximize } from 'lucide-react';
import { FilesetResolver, FaceDetector } from '@mediapipe/tasks-vision';

interface FaceCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onClear: () => void;
  isCaptured: boolean;
  capturedImage: string | null;
}

export function FaceCapture({ onCapture, onClear, isCaptured, capturedImage }: FaceCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<'pending' | 'granted' | 'denied'>('pending');

  // ML Detector State
  const [detector, setDetector] = useState<FaceDetector | null>(null);
  const [isDetectorLoading, setIsDetectorLoading] = useState<boolean>(true);
  
  // Detection Status & Feedback
  const [isFaceValid, setIsFaceValid] = useState<boolean>(false);
  const [detectionMessage, setDetectionMessage] = useState<string>('Initializing AI face detection model...');
  const [faceCount, setFaceCount] = useState<number>(0);
  const [faceBoundingBox, setFaceBoundingBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  // Initialize MediaPipe FaceDetector ML Model
  useEffect(() => {
    let isMounted = true;
    async function initFaceDetector() {
      try {
        setIsDetectorLoading(true);
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
        );
        const faceDetector = await FaceDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          minDetectionConfidence: 0.55
        });

        if (isMounted) {
          setDetector(faceDetector);
          setIsDetectorLoading(false);
          setDetectionMessage('Position student face inside the frame.');
        }
      } catch (err) {
        console.warn('Failed to load MediaPipe GPU model, attempting fallback configuration:', err);
        try {
          const vision = await FilesetResolver.forVisionTasks(
            'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
          );
          const fallbackDetector = await FaceDetector.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
              delegate: 'CPU'
            },
            runningMode: 'VIDEO',
            minDetectionConfidence: 0.5
          });

          if (isMounted) {
            setDetector(fallbackDetector);
            setIsDetectorLoading(false);
            setDetectionMessage('Position student face inside the frame.');
          }
        } catch (cpuErr) {
          console.error('Face detector initialization failed:', cpuErr);
          if (isMounted) {
            setIsDetectorLoading(false);
            setDetectionMessage('Position student face inside the frame.');
          }
        }
      }
    }

    initFaceDetector();
    return () => {
      isMounted = false;
    };
  }, []);

  // Start webcam stream
  const startCamera = useCallback(async () => {
    setCameraError(null);
    setPermissionState('pending');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Browser does not support camera access.');
      setPermissionState('denied');
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      setStream(mediaStream);
      setPermissionState('granted');

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera permission or access error:', err);
      setPermissionState('denied');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission denied. Please allow camera access in browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera device found on this system.');
      } else {
        setCameraError('Unable to access camera: ' + (err.message || 'Unknown error'));
      }
    }
  }, []);

  // Stop webcam stream
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    if (!isCaptured) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isCaptured]);

  // Real-time ML Face Detection Loop
  const detectFacesLoop = useCallback(() => {
    if (!videoRef.current || isCaptured || permissionState !== 'granted') return;
    const video = videoRef.current;
    if (video.readyState < 2) return;

    const videoWidth = video.videoWidth || 640;
    const videoHeight = video.videoHeight || 480;

    if (detector) {
      try {
        const startTimeMs = performance.now();
        const results = detector.detectForVideo(video, startTimeMs);
        const detections = results.detections || [];
        setFaceCount(detections.length);

        if (detections.length === 0) {
          setIsFaceValid(false);
          setFaceBoundingBox(null);
          setDetectionMessage("No face detected. Please position the student's face inside the frame.");
          return;
        }

        if (detections.length > 1) {
          setIsFaceValid(false);
          setFaceBoundingBox(null);
          setDetectionMessage('Multiple faces detected. Only one student should be in the frame.');
          return;
        }

        // Single face detected — validate bounding box geometry & scale
        const face = detections[0];
        const bbox = face.boundingBox;

        if (!bbox) {
          setIsFaceValid(false);
          setDetectionMessage("No face detected. Please position the student's face inside the frame.");
          return;
        }

        const { originX, originY, width, height } = bbox;
        setFaceBoundingBox({ x: originX, y: originY, w: width, h: height });

        // Rule A: Face too far away (face box takes < 18% of frame height or width)
        const minFaceRatioHeight = videoHeight * 0.18;
        const minFaceRatioWidth = videoWidth * 0.18;
        if (height < minFaceRatioHeight || width < minFaceRatioWidth) {
          setIsFaceValid(false);
          setDetectionMessage('Face is too far away. Please move closer.');
          return;
        }

        // Rule B: Face partially outside frame (within 8px boundary of frame edges)
        const margin = 8;
        if (
          originX < margin ||
          originY < margin ||
          originX + width > videoWidth - margin ||
          originY + height > videoHeight - margin
        ) {
          setIsFaceValid(false);
          setDetectionMessage('Please position your full face inside the frame.');
          return;
        }

        // Rule C: Valid single human face
        setIsFaceValid(true);
        setDetectionMessage('✓ Face detected successfully');
        return;
      } catch (err) {
        console.error('Detection frame processing error:', err);
      }
    }

    // Native Shape Detector API Fallback for Chromium browsers if ML model is loading
    if ('FaceDetector' in window) {
      try {
        const NativeDetector = (window as any).FaceDetector;
        const nativeFaceDetector = new NativeDetector({ fastMode: true, maxFaces: 5 });
        nativeFaceDetector.detect(video).then((faces: any[]) => {
          setFaceCount(faces.length);
          if (faces.length === 0) {
            setIsFaceValid(false);
            setDetectionMessage("No face detected. Please position the student's face inside the frame.");
          } else if (faces.length > 1) {
            setIsFaceValid(false);
            setDetectionMessage('Multiple faces detected. Only one student should be in the frame.');
          } else {
            setIsFaceValid(true);
            setDetectionMessage('✓ Face detected successfully');
          }
        }).catch(() => {});
      } catch (nativeErr) {}
    }
  }, [detector, isCaptured, permissionState]);

  useEffect(() => {
    const interval = setInterval(detectFacesLoop, 250);
    return () => clearInterval(interval);
  }, [detectFacesLoop]);

  // Capture face snapshot — ONLY permitted if face is currently valid
  const handleCaptureClick = () => {
    if (!videoRef.current || !isFaceValid) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      onCapture(dataUrl);
      stopCamera();
    }
  };

  const handleRetake = () => {
    onClear();
    setIsFaceValid(false);
    setFaceBoundingBox(null);
    startCamera();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Camera size={18} color="#3b82f6" /> Student Face Capture
        </span>
        {isCaptured && (
          <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle size={16} /> ✓ Face photo captured
          </span>
        )}
      </div>

      {/* Main Camera Viewport */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '250px',
        borderRadius: '16px',
        overflow: 'hidden',
        background: '#0f172a',
        border: isCaptured 
          ? '2px solid #10b981' 
          : isFaceValid 
          ? '2px solid #10b981' 
          : faceCount > 1 
          ? '2px solid #ef4444'
          : '1px solid var(--glass-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
      }}>

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* State 1: Captured Image Preview */}
        {isCaptured && capturedImage ? (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <img 
              src={capturedImage} 
              alt="Captured Student Face" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
            <div style={{
              position: 'absolute', bottom: '12px', left: '12px', right: '12px',
              background: 'rgba(16, 185, 129, 0.9)', backdropFilter: 'blur(8px)',
              padding: '8px 14px', borderRadius: '10px', color: '#fff',
              fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <CheckCircle size={16} /> ✓ Face Captured & Validated
            </div>
          </div>
        ) : permissionState === 'denied' || cameraError ? (
          /* State 2: Camera Permission Error */
          <div style={{ padding: '24px', textAlign: 'center', color: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <CameraOff size={36} color="#ef4444" />
            <div style={{ fontSize: '0.9rem', color: '#ef4444', fontWeight: 600 }}>Camera Access Required</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', maxWidth: '85%' }}>{cameraError || 'Please enable camera permission in your browser.'}</div>
            <button
              onClick={startCamera}
              className="glass-button"
              style={{ padding: '6px 16px', fontSize: '0.8rem', marginTop: '6px', color: '#fff', background: '#3b82f6' }}
            >
              Grant / Retry Camera Permission
            </button>
          </div>
        ) : (
          /* State 3: Live Camera Feed with ML Bounding Overlay */
          <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
            />

            {/* Face Alignment Oval Guide */}
            <div style={{
              position: 'absolute',
              width: '140px',
              height: '180px',
              borderRadius: '50%',
              border: isFaceValid 
                ? '2px solid #10b981' 
                : faceCount > 1 
                ? '2px dashed #ef4444' 
                : '2px dashed rgba(255,255,255,0.6)',
              boxShadow: isFaceValid ? '0 0 15px rgba(16,185,129,0.4)' : '0 0 0 9999px rgba(15, 23, 42, 0.45)',
              pointerEvents: 'none',
              transition: 'all 0.3s ease'
            }} />

            {/* Live Detection Feedback Badge */}
            <div style={{
              position: 'absolute', top: '12px', left: '12px', right: '12px',
              background: isFaceValid 
                ? 'rgba(16, 185, 129, 0.9)' 
                : faceCount > 1 
                ? 'rgba(239, 68, 68, 0.9)' 
                : 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: '10px',
              fontSize: '0.78rem', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px',
              border: '1px solid rgba(255,255,255,0.15)'
            }}>
              {isDetectorLoading ? (
                <RefreshCw size={14} className="spin" />
              ) : isFaceValid ? (
                <CheckCircle size={15} color="#fff" />
              ) : faceCount > 1 ? (
                <Users size={15} color="#fff" />
              ) : (
                <AlertTriangle size={15} color="#f59e0b" />
              )}
              <span>{detectionMessage}</span>
            </div>
          </div>
        )}
      </div>

      {/* Capture Controls */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', alignItems: 'center' }}>
        {isCaptured ? (
          <button
            type="button"
            onClick={handleRetake}
            className="secondary-btn"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', padding: '8px 16px' }}
          >
            <RefreshCw size={15} /> Retake Photo
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCaptureClick}
            disabled={!isFaceValid || permissionState !== 'granted'}
            className="primary-btn"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', padding: '8px 18px',
              opacity: isFaceValid && permissionState === 'granted' ? 1 : 0.5,
              cursor: isFaceValid && permissionState === 'granted' ? 'pointer' : 'not-allowed',
              background: isFaceValid ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(100, 116, 139, 0.4)',
              boxShadow: isFaceValid ? '0 4px 14px rgba(16,185,129,0.3)' : 'none'
            }}
          >
            <Camera size={15} /> Capture Face
          </button>
        )}
      </div>

      <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontStyle: 'italic', marginTop: '-4px' }}>
        ℹ Machine learning face detector ensures an actual human face is present before allowing face capture.
      </div>
    </div>
  );
}
