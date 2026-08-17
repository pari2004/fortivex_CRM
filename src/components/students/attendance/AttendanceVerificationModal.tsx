'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, UserCheck, AlertCircle, CheckCircle, Clock, MapPin, X, FlaskConical, Lock } from 'lucide-react';
import { FaceCapture } from './FaceCapture';
import { LocationCapture, LocationData } from './LocationCapture';
import { AttendanceService } from '@/lib/services/attendanceService';
import { AttendanceRecord, VerificationRequest } from '@/lib/types/attendance';
import { isDevTestModeActive } from '@/lib/config/attendanceConfig';

interface AttendanceVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    id: string;
    name: string;
    batch: string;
    status?: string;
  } | null;
  targetStatus: 'Present' | 'Late';
  onSuccess: (updatedRecord: AttendanceRecord) => void;
}

export function AttendanceVerificationModal({
  isOpen,
  onClose,
  student,
  targetStatus,
  onSuccess
}: AttendanceVerificationModalProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [existingRecord, setExistingRecord] = useState<AttendanceRecord | null>(null);

  // Check for existing today's attendance record when student changes
  useEffect(() => {
    if (student && isOpen) {
      const todayRecord = AttendanceService.getTodayAttendance(student.id);
      setExistingRecord(todayRecord);
    }
  }, [student, isOpen]);

  // Reset internal states on modal close/open
  useEffect(() => {
    if (!isOpen) {
      setCapturedImage(null);
      setLocationData(null);
      setErrorMessage(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen || !student) return null;

  // Verification Rules Evaluation
  const isFaceValid = Boolean(capturedImage);
  const isLocationValid = Boolean(locationData && locationData.isWithinGeofence && locationData.isAccuracySufficient);
  
  // Test Mode Security Check
  const isTestModeRequested = Boolean(locationData?.isTestMode);
  const isTestModePermitted = isDevTestModeActive();
  const isSecurityValid = !isTestModeRequested || isTestModePermitted;

  // Confirm Attendance Button is ONLY enabled when all checks pass
  const isFormValid = isFaceValid && isLocationValid && isSecurityValid;

  const handleConfirmAttendance = async () => {
    if (!isFormValid || !locationData || !capturedImage) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload: VerificationRequest = {
      studentId: student.id,
      studentName: student.name,
      batch: student.batch,
      status: targetStatus,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      locationAccuracy: locationData.accuracy,
      faceImageDataUrl: capturedImage,
      isTestMode: locationData.isTestMode,
      isDesktopTesting: locationData.isTestMode
    };

    try {
      // Call verification service / route handler
      const res = await fetch('/api/students/attendance/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success && data.record) {
        onSuccess(data.record);
        onClose();
      } else {
        setErrorMessage(data.message || 'Verification failed. Please retry.');
      }
    } catch (err: any) {
      console.error('Attendance confirmation error:', err);
      // Fallback directly to client service if network/API route unavailable
      try {
        const directResult = await AttendanceService.verifyAndRecordAttendance(payload);
        if (directResult.success && directResult.record) {
          onSuccess(directResult.record);
          onClose();
        } else {
          setErrorMessage(directResult.message || 'Verification failed.');
        }
      } catch (fallbackErr: any) {
        setErrorMessage('Failed to connect to verification server. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(12px)' }}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="glass-panel"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            background: 'var(--glass-bg-heavy)',
            backdropFilter: 'var(--glass-blur-heavy)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid var(--glass-border-strong)'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.95), rgba(29, 78, 216, 0.95))',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <ShieldCheck size={22} color="#fff" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#fff' }}>Verify Student Attendance</h3>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)' }}>
                  Marking as <strong style={{ color: targetStatus === 'Present' ? '#6ee7b7' : '#fcd34d' }}>{targetStatus}</strong>
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                padding: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
                border: 'none', color: '#fff', cursor: 'pointer', display: 'flex'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Content */}
          <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Student Info Card */}
            <div style={{
              padding: '14px 18px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>{student.name}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>ID: {student.id} • Batch: {student.batch}</div>
              </div>
              <span style={{
                padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 600,
                background: targetStatus === 'Present' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                color: targetStatus === 'Present' ? '#10b981' : '#f59e0b'
              }}>
                {targetStatus}
              </span>
            </div>

            {/* Test Mode Banner in Modal */}
            {isTestModeRequested && (
              <div style={{
                padding: '10px 14px', borderRadius: '12px',
                background: isTestModePermitted ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: isTestModePermitted ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
                color: isTestModePermitted ? '#f59e0b' : '#ef4444',
                fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px'
              }}>
                {isTestModePermitted ? <FlaskConical size={18} /> : <Lock size={18} />}
                <div>
                  <div>{isTestModePermitted ? '🧪 DEV TEST MODE ACTIVE' : '⚠ Test Mode Disabled in Production'}</div>
                  <div style={{ fontSize: '0.76rem', opacity: 0.9, marginTop: '2px', fontWeight: 400 }}>
                    {isTestModePermitted 
                      ? 'Simulated location active for local localhost testing.'
                      : 'Test mode simulated locations cannot be submitted in production environment.'}
                  </div>
                </div>
              </div>
            )}

            {/* Duplicate Attendance Alert Banner */}
            {existingRecord && (
              <div style={{
                padding: '12px 16px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.3)', color: '#f59e0b', fontSize: '0.85rem',
                display: 'flex', alignItems: 'center', gap: '10px'
              }}>
                <AlertCircle size={18} />
                <div>
                  <strong>Attendance already marked for today.</strong>
                  <div style={{ fontSize: '0.78rem', opacity: 0.9 }}>
                    Current status: {existingRecord.status} ({existingRecord.checkInTime || 'Today'}). Confirming will update the record.
                  </div>
                </div>
              </div>
            )}

            {/* Error Message Banner */}
            {errorMessage && (
              <div style={{
                padding: '12px 16px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', fontSize: '0.85rem',
                display: 'flex', alignItems: 'center', gap: '10px'
              }}>
                <AlertCircle size={18} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1. Face Capture Section */}
            <FaceCapture
              onCapture={(url) => setCapturedImage(url)}
              onClear={() => setCapturedImage(null)}
              isCaptured={isFaceValid}
              capturedImage={capturedImage}
            />

            {/* 2. Location Capture Section */}
            <LocationCapture
              onLocationCaptured={(loc) => setLocationData(loc)}
              onClear={() => setLocationData(null)}
              locationData={locationData}
            />

            {/* Verification Summary Checklist */}
            <div style={{
              padding: '14px', borderRadius: '12px', background: 'rgba(0,0,0,0.03)',
              border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '8px'
            }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Verification Checklist</div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isFaceValid ? '#10b981' : 'var(--text-tertiary)' }}>
                  {isFaceValid ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                  <span>Face Capture: {isFaceValid ? '✓ Photo Validated' : 'Pending'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isLocationValid ? '#10b981' : 'var(--text-tertiary)' }}>
                  {isLocationValid ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                  <span>GPS Geofence: {isLocationValid ? '✓ Verified' : locationData && !locationData.isAccuracySufficient ? 'Low Accuracy' : 'Pending'}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Modal Footer */}
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-color)',
            background: 'rgba(255,255,255,0.04)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <button
              type="button"
              onClick={onClose}
              className="secondary-btn"
              disabled={isSubmitting}
              style={{ fontSize: '0.9rem' }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirmAttendance}
              disabled={!isFormValid || isSubmitting}
              className="primary-btn"
              style={{
                fontSize: '0.9rem',
                padding: '10px 24px',
                opacity: isFormValid && !isSubmitting ? 1 : 0.5,
                cursor: isFormValid && !isSubmitting ? 'pointer' : 'not-allowed',
                background: isFormValid ? (targetStatus === 'Present' ? '#10b981' : '#f59e0b') : 'rgba(100, 116, 139, 0.4)',
                boxShadow: isFormValid ? (targetStatus === 'Present' ? '0 4px 14px rgba(16,185,129,0.3)' : '0 4px 14px rgba(245,158,11,0.3)') : 'none'
              }}
            >
              {isSubmitting ? 'Verifying & Saving...' : 'Confirm Attendance'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
