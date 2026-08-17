import { NextRequest, NextResponse } from 'next/server';
import { AttendanceService } from '@/lib/services/attendanceService';
import { VerificationRequest } from '@/lib/types/attendance';

export async function POST(req: NextRequest) {
  try {
    const body: VerificationRequest = await req.json();

    if (!body.studentId || !body.latitude || !body.longitude || !body.faceImageDataUrl) {
      return NextResponse.json(
        { success: false, message: 'Invalid payload. Missing required fields.' },
        { status: 400 }
      );
    }

    const result = await AttendanceService.verifyAndRecordAttendance(body);

    if (!result.success) {
      return NextResponse.json(result, { status: 422 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Error verifying student attendance:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected server error occurred during attendance verification.',
        errors: [error?.message || 'Internal Server Error']
      },
      { status: 500 }
    );
  }
}
