'use client';

import { useState } from 'react';
import { Button, Card } from '@nextui-org/react';
import { authService } from '@/lib/auth/authService';
import Image from 'next/image';

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      console.log('Attempting Google sign in...');
      const { error: signInError } = await authService.signInWithGoogle();
      if (signInError) {
        console.error('Sign in error:', signInError);
        throw signInError;
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6 space-y-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-primary-500 rounded-full mx-auto flex items-center justify-center">
          <span className="text-2xl font-bold text-white">DA</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Welcome to DealmyArea</h2>
        <p className="text-small text-gray-500 dark:text-gray-400">
          Sign in to discover the best deals in your area
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Button
          color="default"
          variant="bordered"
          onPress={handleGoogleSignIn}
          isLoading={loading}
          startContent={
            !loading && (
              <Image
                src="/google.svg"
                alt="Google"
                width={20}
                height={20}
                className="min-w-[20px]"
              />
            )
          }
          className="w-full h-12 text-base bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          {loading ? 'Signing in...' : 'Continue with Google'}
        </Button>

        {error && (
          <div className="p-3 rounded-lg bg-danger-50 dark:bg-danger-900/20 text-danger text-center text-small">
            {error}
          </div>
        )}
      </div>

      <div className="text-center text-small text-gray-500 dark:text-gray-400">
        By continuing, you agree to our{' '}
        <a href="/terms" className="text-primary-500 hover:underline">Terms of Service</a>
        {' '}and{' '}
        <a href="/privacy" className="text-primary-500 hover:underline">Privacy Policy</a>
      </div>
    </Card>
  );
} 