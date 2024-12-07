'use client';

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export function CTASection() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/signup');
  };

  const handleSignIn = () => {
    router.push('/login');
  };

  return (
    <div className="bg-primary-500">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="block">Ready to start saving?</span>
          <span className="block text-primary-100">
            Join thousands of smart shoppers today.
          </span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <Button
              color="default"
              size="lg"
              className="bg-white text-primary-500 hover:bg-gray-50"
              onPress={handleGetStarted}
            >
              Get Started
            </Button>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <Button
              variant="bordered"
              size="lg"
              className="text-white border-white hover:bg-primary-400"
              onPress={handleSignIn}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 