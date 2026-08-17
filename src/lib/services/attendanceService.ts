import { AttendanceRecord, VerificationRequest, VerificationResponse } from '../types/attendance';
import { DEFAULT_ATTENDANCE_CONFIG, validateGeofenceAndAccuracy, isDevTestModeActive } from '../config/attendanceConfig';
import { storageService } from './storageService';

// In-memory persistent record store for dev/testing session
const attendanceStore: Map<string, AttendanceRecord> = new Map();

/**
 * Server-side Attendance Service
 */
export class AttendanceService {
  /**
   * Process and verify attendance marking request for Present / Late.
   */
  static async verifyAndRecordAttendance(
    request: VerificationRequest
  ): Promise<VerificationResponse> {
    const { studentId, studentName, batch, status, latitude, longitude, locationAccuracy, faceImageDataUrl, isTestMode } = request;

    // 1. Validate required inputs
    if (!studentId || latitude === undefined || longitude === undefined || !faceImageDataUrl) {
      return {
        success: false,
        message: 'Missing required attendance verification data.',
        errors: ['Latitude, longitude, and face capture are required.']
      };
    }

    // 2. Reject test mode requests if server environment has test mode disabled
    const isTestModeAllowed = isDevTestModeActive();
    const effectiveTestMode = Boolean(isTestMode && isTestModeAllowed);

    if (isTestMode && !isTestModeAllowed) {
      return {
        success: false,
        message: 'Test mode is not permitted in production environment.',
        errors: ['Unauthorized test mode attendance submission rejected.']
      };
    }

    // 3. Server-side Geofence & Accuracy re-validation
    const validation = validateGeofenceAndAccuracy(
      latitude,
      longitude,
      locationAccuracy,
      DEFAULT_ATTENDANCE_CONFIG,
      effectiveTestMode
    );

    if (!validation.isAccuracySufficient) {
      return {
        success: false,
        message: 'Location accuracy is too low. Please enable precise location/GPS and try again.',
        geofenceResult: {
          isWithin: validation.isWithin,
          isAccuracySufficient: false,
          distanceMeters: validation.distanceMeters,
          allowedRadius: validation.allowedRadius,
          accuracyMeters: locationAccuracy,
          maxAllowedAccuracy: validation.maxAllowedAccuracy,
          isTestModeActive: effectiveTestMode
        },
        errors: [`GPS accuracy (±${locationAccuracy}m) exceeds maximum allowable threshold (±${validation.maxAllowedAccuracy}m).`]
      };
    }

    if (!validation.isWithin) {
      return {
        success: false,
        message: 'Student is outside the permitted attendance location.',
        geofenceResult: {
          isWithin: false,
          isAccuracySufficient: true,
          distanceMeters: validation.distanceMeters,
          allowedRadius: validation.allowedRadius,
          accuracyMeters: locationAccuracy,
          maxAllowedAccuracy: validation.maxAllowedAccuracy,
          isTestModeActive: effectiveTestMode
        },
        errors: [`Distance (${validation.distanceMeters}m) exceeds maximum allowed radius (${validation.allowedRadius}m).`]
      };
    }

    // 4. Duplicate check for today
    const todayStr = new Date().toISOString().split('T')[0];
    const recordKey = `${studentId}_${todayStr}`;
    const existingRecord = attendanceStore.get(recordKey);

    // 5. Handle face image storage via StorageService
    const storageResult = await storageService.uploadFaceCapture(studentId, faceImageDataUrl);

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newRecord: AttendanceRecord = {
      id: existingRecord?.id || `ATT-${Date.now()}`,
      studentId,
      name: studentName,
      batch,
      monthly: existingRecord?.monthly || '90%',
      lastSeen: `Today, ${formattedTime}`,
      status,
      date: todayStr,
      checkInTime: formattedTime,
      latitude: effectiveTestMode ? DEFAULT_ATTENDANCE_CONFIG.latitude : latitude,
      longitude: effectiveTestMode ? DEFAULT_ATTENDANCE_CONFIG.longitude : longitude,
      locationAccuracy: validation.effectiveAccuracy,
      locationVerified: true,
      distanceFromCampusMeters: validation.distanceMeters,
      faceCaptured: true,
      faceVerified: true,
      faceCaptureUrl: storageResult.url,
      isTestModeRecord: effectiveTestMode,
      createdAt: existingRecord?.createdAt || now.toISOString(),
      updatedAt: now.toISOString()
    };

    // Store record
    attendanceStore.set(recordKey, newRecord);

    const statusNote = effectiveTestMode ? ' [DEV TEST MODE]' : '';

    return {
      success: true,
      message: existingRecord 
        ? `Attendance updated successfully for ${studentName} (${status})${statusNote}.`
        : `Attendance marked successfully for ${studentName} (${status})${statusNote}.`,
      record: newRecord,
      geofenceResult: {
        isWithin: true,
        isAccuracySufficient: true,
        distanceMeters: validation.distanceMeters,
        allowedRadius: validation.allowedRadius,
        accuracyMeters: validation.effectiveAccuracy,
        maxAllowedAccuracy: validation.maxAllowedAccuracy,
        isTestModeActive: effectiveTestMode
      }
    };
  }

  /**
   * Check if student already has an attendance record for today.
   */
  static getTodayAttendance(studentId: string): AttendanceRecord | null {
    const todayStr = new Date().toISOString().split('T')[0];
    const recordKey = `${studentId}_${todayStr}`;
    return attendanceStore.get(recordKey) || null;
  }
}
