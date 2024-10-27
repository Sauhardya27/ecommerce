import { NextResponse } from 'next/server';
import { User, UserOTPVerification } from '@/lib/models';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId, otp } = await req.json();

    if (!userId || !otp) {
      return NextResponse.json(
        { error: 'Empty OTP details are not allowed' },
        { status: 400 }
      );
    }

    const userOTPVerificationRecord = await UserOTPVerification.findOne({
      userId
    }).sort({ createdAt: -1 });

    if (!userOTPVerificationRecord) {
      return NextResponse.json(
        { error: 'No OTP record found' },
        { status: 400 }
      );
    }

    if (userOTPVerificationRecord.expiresAt < new Date()) {
      await UserOTPVerification.deleteOne({ _id: userOTPVerificationRecord._id });
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one' },
        { status: 400 }
      );
    }

    const validOTP = await bcrypt.compare(otp, userOTPVerificationRecord.otp);

    if (!validOTP) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    await User.updateOne(
      { _id: userId },
      { verified: true }
    );

    await UserOTPVerification.deleteMany({ userId });

    return NextResponse.json({
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Error in verify-otp:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}