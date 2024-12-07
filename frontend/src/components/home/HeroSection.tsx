'use client';

import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/signup');
  };

  const handleSignIn = () => {
    router.push('/login');
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            <span className="block">Your Ultimate</span>
            <span className="block text-primary-500">Local Shopping Companion</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Discover the best local deals, compare prices effortlessly, and make informed purchasing decisions.
            Perfect for savvy shoppers and deal hunters alike!
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Button
                color="primary"
                size="lg"
                className="w-full"
                onPress={handleGetStarted}
              >
                Get Started
              </Button>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <Button
                variant="bordered"
                size="lg"
                className="w-full"
                onPress={handleSignIn}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 