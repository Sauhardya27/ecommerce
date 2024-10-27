import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { User, UserOTPVerification } from '@/lib/models';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      verified: false
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await bcrypt.hash(otp, 10);

    await UserOTPVerification.create({
      userId: newUser._id,
      otp: hashedOTP,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification',
      html: `
        <h1>Verify Your Email</h1>
        <p>Enter this code to verify your email: <strong>${otp}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      message: 'Verification OTP sent to email',
      userId: newUser._id
    });

  } catch (error) {
    console.error('Error in send-otp:', error);
    return NextResponse.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}