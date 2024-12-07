'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardBody, CardHeader } from "@nextui-org/react";
import { SocialAuthButton } from '@/components/auth/SocialAuthButton';
import { useAuth, type SocialProvider } from '@/lib/hooks/useAuth';
import { useToast } from '@/lib/hooks/useToast';
import Link from 'next/link';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null);
  const router = useRouter();
  const { signUp, signInWithSocial } = useAuth();
  const { showToast } = useToast();

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return 'Password must contain at least one special character (!@#$%^&*)';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      showToast(passwordError, 'error');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, displayName);
      showToast('Account created! Please check your email for verification.', 'success');
      router.push('/login');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to create account', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: SocialProvider) => {
    setSocialLoading(provider);

    try {
      await signInWithSocial(provider);
      showToast('Successfully signed in!', 'success');
      router.push('/dashboard');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to sign in', 'error');
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 text-center">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-default-500">Sign up to get started</p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="text"
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              color="primary"
              isLoading={loading}
              className="w-full"
            >
              Sign Up
            </Button>
          </form>

          <div className="my-4 flex items-center">
            <div className="flex-1 border-t"></div>
            <span className="mx-4 text-default-500">or</span>
            <div className="flex-1 border-t"></div>
          </div>

          <div className="flex flex-col gap-2">
            <SocialAuthButton
              provider="google"
              onPress={() => handleSocialSignIn('google')}
              isLoading={socialLoading === 'google'}
            />
          </div>

          <div className="mt-4 text-center text-sm">
            <span className="text-default-500">Already have an account? </span>
            <Link
              href="/login"
              className="text-primary hover:underline"
            >
              Sign In
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
} 