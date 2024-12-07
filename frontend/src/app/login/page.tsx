'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardBody, CardHeader } from "@nextui-org/react";
import { SocialAuthButton } from '@/components/auth/SocialAuthButton';
import { useAuth, type SocialProvider } from '@/lib/hooks/useAuth';
import { useToast } from '@/lib/hooks/useToast';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<SocialProvider | null>(null);
  const router = useRouter();
  const { signIn, signInWithSocial, sendPasswordReset } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      showToast('Successfully signed in!', 'success');
      router.push('/dashboard');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to sign in', 'error');
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

  const handlePasswordReset = async () => {
    if (!email) {
      showToast('Please enter your email address', 'error');
      return;
    }

    try {
      await sendPasswordReset(email);
      showToast('Password reset email sent!', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to send reset email', 'error');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 text-center">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-default-500">Sign in to continue</p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            <Button
              type="submit"
              color="primary"
              isLoading={loading}
              className="w-full"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-4">
            <Button
              variant="light"
              onPress={handlePasswordReset}
              className="w-full"
              size="sm"
            >
              Forgot Password?
            </Button>
          </div>

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
            <span className="text-default-500">Don't have an account? </span>
            <Link
              href="/signup"
              className="text-primary hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
} 