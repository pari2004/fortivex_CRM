export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  name: string;
  batch: string;
  monthly: string;
  lastSeen: string;
  status: AttendanceStatus;
  date: string; // YYYY-MM-DD
  checkInTime?: string;
  latitude?: number | null;
  longitude?: number | null;
  locationAccuracy?: number | null;
  locationVerified?: boolean;
  distanceFromCampusMeters?: number | null;
  faceCaptured?: boolean;
  faceVerified?: boolean;
  faceCaptureUrl?: string | null;
  isTestModeRecord?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationRequest {
  studentId: string;
  studentName: string;
  batch: string;
  status: 'Present' | 'Late';
  latitude: number;
  longitude: number;
  locationAccuracy: number;
  faceImageDataUrl: string; // base64 representation of captured photo
  isTestMode?: boolean;
  isDesktopTesting?: boolean;
  notes?: string;
}

export interface VerificationResponse {
  success: boolean;
  message: string;
  record?: AttendanceRecord;
  errors?: string[];
  geofenceResult?: {
    isWithin: boolean;
    isAccuracySufficient: boolean;
    distanceMeters: number;
    allowedRadius: number;
    accuracyMeters: number;
    maxAllowedAccuracy: number;
    isTestModeActive: boolean;
  };
}
