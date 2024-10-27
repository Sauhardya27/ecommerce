"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const SignUp: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [isOtpView, setIsOtpView] = useState(false);
  const [userId, setUserId] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      setUserId(data.userId);
      setIsOtpView(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 5) {
      const nextInput = document.querySelector(
        `input[name='otp-${index + 1}']`
      ) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }

    if (value === '' && index > 0) {
      const prevInput = document.querySelector(
        `input[name='otp-${index - 1}']`
      ) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const otpString = otp.join('');
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          otp: otpString,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify code');
      }

      router.push('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      const prevInput = document.querySelector(
        `input[name='otp-${index - 1}']`
      ) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div className="flex items-center justify-center bg-white pt-12">
      <div className="w-full max-w-md rounded-xl bg-white p-8 border border-gray-300">
        {error && (
          <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        {!isOtpView ? (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-center">Create your account</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Enter"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Enter"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Enter"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-black py-2 text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:bg-gray-400"
              >
                {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
              </button>
            </form>

            <div className="text-center text-sm">
              Have an Account?{' '}
              <a href="/login" className="text-black font-semibold hover:underline">
                LOGIN
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold">Verify your email</h2>
              <p className="mt-2 text-sm text-gray-600">
                Enter the 6 digit code you have received on
                <br />
                {formData.email}
              </p>
            </div>

            <form onSubmit={handleVerifyOtp}>
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700">Code</label>
                <div className="flex gap-2 justify-between">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      name={`otp-${index}`}
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="w-12 h-12 text-center border border-gray-300 rounded-md text-lg focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.some(digit => digit === '')}
                  className="w-full rounded-md bg-black py-2 text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:bg-gray-400"
                >
                  {loading ? 'VERIFYING...' : 'VERIFY'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;