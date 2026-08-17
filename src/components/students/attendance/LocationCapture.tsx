'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapPin, CheckCircle2, XCircle, AlertTriangle, RefreshCw, FlaskConical, Info } from 'lucide-react';
import { DEFAULT_ATTENDANCE_CONFIG, validateGeofenceAndAccuracy, isDevTestModeActive } from '@/lib/config/attendanceConfig';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  distanceMeters: number;
  isWithinGeofence: boolean;
  isAccuracySufficient: boolean;
  isTestMode?: boolean;
}

interface LocationCaptureProps {
  onLocationCaptured: (data: LocationData) => void;
  onClear: () => void;
  locationData: LocationData | null;
}

export function LocationCapture({ onLocationCaptured, onClear, locationData }: LocationCaptureProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [acquisitionStatus, setAcquisitionStatus] = useState<string>('Detecting GPS location...');
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
  const [customRadius, setCustomRadius] = useState<number>(DEFAULT_ATTENDANCE_CONFIG.radiusMeters);
  
  // Developer test mode state (defaults to env variable status)
  const [isTestMode, setIsTestMode] = useState<boolean>(isDevTestModeActive());
  const [showConfig, setShowConfig] = useState<boolean>(false);

  const watchIdRef = useRef<number | null>(null);
  const bestPositionRef = useRef<GeolocationPosition | null>(null);
  const sampleCountRef = useRef<number>(0);

  const clearWatch = () => {
    if (watchIdRef.current !== null && typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  };

  const emitLocationData = useCallback((lat: number, lng: number, rawAccuracy: number, testModeActive: boolean) => {
    const config = {
      ...DEFAULT_ATTENDANCE_CONFIG,
      radiusMeters: customRadius
    };

    const validation = validateGeofenceAndAccuracy(lat, lng, rawAccuracy, config, testModeActive);

    const data: LocationData = {
      latitude: testModeActive ? config.latitude : lat,
      longitude: testModeActive ? config.longitude : lng,
      accuracy: testModeActive ? 10 : rawAccuracy,
      distanceMeters: validation.distanceMeters,
      isWithinGeofence: validation.isWithin,
      isAccuracySufficient: validation.isAccuracySufficient,
      isTestMode: testModeActive
    };

    onLocationCaptured(data);
    return validation;
  }, [customRadius, onLocationCaptured]);

  const processPosition = (position: GeolocationPosition, forceFinalize: boolean = false) => {
    const currentAcc = position.coords.accuracy;
    if (!bestPositionRef.current || currentAcc < bestPositionRef.current.coords.accuracy) {
      bestPositionRef.current = position;
    }

    const targetPos = bestPositionRef.current || position;
    const lat = targetPos.coords.latitude;
    const lng = targetPos.coords.longitude;
    const rawAccuracy = Math.round(targetPos.coords.accuracy);

    const validation = emitLocationData(lat, lng, rawAccuracy, isTestMode);

    if (validation.isAccuracySufficient || forceFinalize) {
      clearWatch();
      setLoading(false);
    }
  };

  const startLocationAcquisition = useCallback(() => {
    clearWatch();

    // If Test Mode is active, bypass hardware GPS requirement cleanly
    if (isTestMode) {
      setLoading(false);
      setError(null);
      setPermissionDenied(false);
      emitLocationData(DEFAULT_ATTENDANCE_CONFIG.latitude, DEFAULT_ATTENDANCE_CONFIG.longitude, 10, true);
      return;
    }

    setLoading(true);
    setError(null);
    setPermissionDenied(false);
    sampleCountRef.current = 0;
    bestPositionRef.current = null;
    setAcquisitionStatus('Requesting high-accuracy GPS fix...');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    const geoOptions: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 15000
    };

    // Standard production mobile GPS acquisition
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        sampleCountRef.current++;
        processPosition(pos, false);
      },
      (err) => {
        console.warn('getCurrentPosition error:', err);
      },
      geoOptions
    );

    // Watch position refinement stream
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        sampleCountRef.current++;
        setAcquisitionStatus(`Refining GPS accuracy (Sample #${sampleCountRef.current})...`);
        processPosition(pos, false);
      },
      (err) => {
        console.error('WatchPosition error:', err);
        clearWatch();
        setLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionDenied(true);
          setError('Please enable location access to mark attendance.');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError('GPS location unavailable. Please verify GPS signal or network connection.');
        } else if (err.code === err.TIMEOUT) {
          if (bestPositionRef.current) {
            processPosition(bestPositionRef.current, true);
          } else {
            setError('Location accuracy is too low. Please enable precise location/GPS and try again.');
          }
        } else {
          setError(err.message || 'Failed to detect location.');
        }
      },
      geoOptions
    );

    // Timeout fallback after 8 seconds
    setTimeout(() => {
      if (watchIdRef.current !== null) {
        if (bestPositionRef.current) {
          processPosition(bestPositionRef.current, true);
        } else {
          setLoading(false);
          clearWatch();
        }
      }
    }, 8000);
  }, [isTestMode, emitLocationData]);

  useEffect(() => {
    startLocationAcquisition();
    return () => clearWatch();
  }, [isTestMode]);

  const handleTestModeToggle = (enabled: boolean) => {
    setIsTestMode(enabled);
  };

  const handleRadiusChange = (newRadius: number) => {
    setCustomRadius(newRadius);
    if (locationData) {
      const config = {
        ...DEFAULT_ATTENDANCE_CONFIG,
        radiusMeters: newRadius
      };
      const validation = validateGeofenceAndAccuracy(
        locationData.latitude,
        locationData.longitude,
        locationData.accuracy,
        config,
        isTestMode
      );
      onLocationCaptured({
        ...locationData,
        isWithinGeofence: validation.isWithin,
        isAccuracySufficient: validation.isAccuracySufficient,
        isTestMode
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={18} color="#3b82f6" /> Student GPS Location
        </span>
        <button
          type="button"
          onClick={startLocationAcquisition}
          disabled={loading}
          style={{ fontSize: '0.78rem', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}
        >
          <RefreshCw size={13} className={loading ? 'spin' : ''} /> {loading ? 'Acquiring...' : 'Refresh Location'}
        </button>
      </div>

      {/* Geolocation Card */}
      <div style={{
        padding: '16px',
        borderRadius: '14px',
        background: locationData?.isWithinGeofence && locationData?.isAccuracySufficient
          ? 'rgba(16, 185, 129, 0.08)' 
          : locationData
          ? 'rgba(239, 68, 68, 0.08)' 
          : 'rgba(255, 255, 255, 0.05)',
        border: locationData?.isWithinGeofence && locationData?.isAccuracySufficient
          ? '1px solid rgba(16, 185, 129, 0.3)' 
          : locationData
          ? '1px solid rgba(239, 68, 68, 0.3)' 
          : '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {loading && !locationData ? (
          <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            📍 {acquisitionStatus}
          </div>
        ) : permissionDenied || (error && !locationData) ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={16} /> ⚠ Location permission required
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {error || 'Please enable location access to mark attendance.'}
            </p>
            <button
              onClick={startLocationAcquisition}
              style={{ padding: '6px 12px', background: '#3b82f6', color: '#fff', borderRadius: '8px', border: 'none', width: 'fit-content', fontSize: '0.8rem', marginTop: '6px', fontWeight: 500 }}
            >
              Grant / Retry Location Access
            </button>
          </div>
        ) : locationData ? (
          <>
            {/* Dev Test Mode Indicator Banner */}
            {isTestMode && (
              <div style={{
                padding: '8px 12px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)', color: '#f59e0b', fontSize: '0.8rem',
                fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <FlaskConical size={16} /> 🧪 DEV TEST MODE ACTIVE: Simulated Campus Location (12.982400, 76.113600 ±10m)
              </div>
            )}

            {/* Coordinates Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', fontSize: '0.82rem' }}>
              <div>
                <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '0.72rem' }}>Latitude</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{locationData.latitude.toFixed(6)}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '0.72rem' }}>Longitude</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{locationData.longitude.toFixed(6)}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '0.72rem' }}>Accuracy</span>
                <span style={{
                  fontWeight: 600,
                  color: locationData.isAccuracySufficient ? 'var(--text-primary)' : '#ef4444'
                }}>
                  ±{locationData.accuracy}m
                </span>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)', display: 'block', fontSize: '0.72rem' }}>Distance</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{locationData.distanceMeters.toLocaleString()}m</span>
              </div>
            </div>

            {/* Accuracy Warning Banner if GPS accuracy is too poor in production mode */}
            {!locationData.isAccuracySufficient && !isTestMode && (
              <div style={{
                padding: '10px 12px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', fontSize: '0.8rem',
                fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <AlertTriangle size={16} />
                <div>
                  <div>Location accuracy is too low. Please enable precise location/GPS and try again.</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.9, marginTop: '2px' }}>
                    Current accuracy ±{locationData.accuracy}m exceeds maximum allowed threshold (±{DEFAULT_ATTENDANCE_CONFIG.maxAccuracyThresholdMeters}m).
                  </div>
                </div>
              </div>
            )}

            {/* Geofence Status Banner */}
            <div style={{
              padding: '10px 12px',
              borderRadius: '10px',
              background: locationData.isWithinGeofence && locationData.isAccuracySufficient 
                ? 'rgba(16, 185, 129, 0.15)' 
                : 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {locationData.isWithinGeofence && locationData.isAccuracySufficient ? (
                  <CheckCircle2 size={18} color="#10b981" />
                ) : (
                  <XCircle size={18} color="#ef4444" />
                )}
                <div>
                  <div style={{
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: locationData.isWithinGeofence && locationData.isAccuracySufficient ? '#10b981' : '#ef4444'
                  }}>
                    {locationData.isWithinGeofence && locationData.isAccuracySufficient
                      ? '✓ Within allowed attendance area' 
                      : !locationData.isAccuracySufficient
                      ? '✕ Insufficient GPS Accuracy'
                      : '✕ Outside allowed attendance area'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Distance: {locationData.distanceMeters.toLocaleString()}m from campus (Allowed radius: {customRadius}m)
                  </div>
                </div>
              </div>
            </div>

            {!locationData.isWithinGeofence && locationData.isAccuracySufficient && (
              <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={14} /> Student is outside the permitted attendance location.
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* Geofence Settings & Developer Config Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
        <span>📍 Campus: {DEFAULT_ATTENDANCE_CONFIG.instituteName} ({DEFAULT_ATTENDANCE_CONFIG.latitude.toFixed(4)}, {DEFAULT_ATTENDANCE_CONFIG.longitude.toFixed(4)})</span>
        <button
          type="button"
          onClick={() => setShowConfig(!showConfig)}
          style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
        >
          {showConfig ? 'Hide Controls' : 'Geofence & Dev Config'}
        </button>
      </div>

      {showConfig && (
        <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span>Allowed Radius:</span>
            <input
              type="number"
              value={customRadius}
              onChange={(e) => handleRadiusChange(Number(e.target.value))}
              style={{ width: '80px', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)' }}
            />
            <span>meters</span>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-primary)', fontWeight: 500 }}>
              <input
                type="checkbox"
                checked={isTestMode}
                onChange={(e) => handleTestModeToggle(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <span>Developer Test Mode (Simulate High-Precision Campus GPS)</span>
            </label>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
            ℹ Set NEXT_PUBLIC_ATTENDANCE_TEST_MODE=true in .env.local for automated local desktop testing.
          </div>
        </div>
      )}
    </div>
  );
}
