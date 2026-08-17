// Attendance Location and Geofencing Configuration

export interface AttendanceLocationConfig {
  latitude: number;
  longitude: number;
  radiusMeters: number;
  maxAccuracyThresholdMeters: number;
  instituteName: string;
  isTestModeEnabled: boolean;
}

const getEnvNumber = (key: string, nextKey: string, fallback: number): number => {
  const val = process.env[key] || process.env[nextKey];
  if (!val) return fallback;
  const parsed = parseFloat(val);
  return isNaN(parsed) ? fallback : parsed;
};

/**
 * Checks if dev test mode environment variable is explicitly set to 'true'.
 * Never automatically active in production unless explicitly configured.
 */
export const isDevTestModeActive = (): boolean => {
  return (
    process.env.NEXT_PUBLIC_ATTENDANCE_TEST_MODE === 'true' ||
    process.env.ATTENDANCE_TEST_MODE === 'true'
  );
};

// Fixed, authoritative Fortivex AI Campus Coordinates (12.982400, 76.113600)
export const DEFAULT_ATTENDANCE_CONFIG: AttendanceLocationConfig = {
  latitude: getEnvNumber('ATTENDANCE_LOCATION_LAT', 'NEXT_PUBLIC_ATTENDANCE_LOCATION_LAT', 12.982400),
  longitude: getEnvNumber('ATTENDANCE_LOCATION_LNG', 'NEXT_PUBLIC_ATTENDANCE_LOCATION_LNG', 76.113600),
  radiusMeters: getEnvNumber('ATTENDANCE_RADIUS_METERS', 'NEXT_PUBLIC_ATTENDANCE_RADIUS_METERS', 500),
  maxAccuracyThresholdMeters: getEnvNumber('ATTENDANCE_MAX_ACCURACY', 'NEXT_PUBLIC_ATTENDANCE_MAX_ACCURACY', 500),
  instituteName: process.env.INSTITUTE_NAME || process.env.NEXT_PUBLIC_INSTITUTE_NAME || 'Fortivex AI Main Campus',
  isTestModeEnabled: isDevTestModeActive(),
};

/**
 * Calculates the distance in meters between two GPS coordinates using the Haversine formula.
 */
export function calculateDistanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

/**
 * Validates student GPS coordinates against configured campus geofence and accuracy threshold.
 */
export function validateGeofenceAndAccuracy(
  currentLat: number,
  currentLng: number,
  accuracyMeters: number,
  config: AttendanceLocationConfig = DEFAULT_ATTENDANCE_CONFIG,
  isTestModeRequest: boolean = false
): { 
  isWithin: boolean; 
  isAccuracySufficient: boolean;
  distanceMeters: number;
  effectiveAccuracy: number;
  maxAllowedAccuracy: number;
  allowedRadius: number;
  isTestModeActive: boolean;
} {
  const isTestMode = isTestModeRequest && isDevTestModeActive();

  // In test mode, location uses default campus coordinates with simulated 10m accuracy
  const effectiveLat = isTestMode ? config.latitude : currentLat;
  const effectiveLng = isTestMode ? config.longitude : currentLng;
  const effectiveAccuracy = isTestMode ? 10 : accuracyMeters;

  const distanceMeters = calculateDistanceInMeters(
    effectiveLat,
    effectiveLng,
    config.latitude,
    config.longitude
  );

  const isAccuracySufficient = effectiveAccuracy <= config.maxAccuracyThresholdMeters;
  const isWithin = distanceMeters <= config.radiusMeters;

  return {
    isWithin,
    isAccuracySufficient,
    distanceMeters,
    effectiveAccuracy,
    maxAllowedAccuracy: config.maxAccuracyThresholdMeters,
    allowedRadius: config.radiusMeters,
    isTestModeActive: isTestMode,
  };
}
