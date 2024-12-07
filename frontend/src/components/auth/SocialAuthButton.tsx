'use client';

import { Button } from "@nextui-org/react";
import { SocialProvider } from "@/lib/hooks/useAuth";
import { 
  FaGoogle, 
  FaFacebook, 
  FaGithub, 
  FaTwitter 
} from "react-icons/fa";

const providerIcons = {
  google: FaGoogle,
  facebook: FaFacebook,
  github: FaGithub,
  twitter: FaTwitter
};

const providerColors = {
  google: "bg-white text-black border-gray-300 hover:bg-gray-50",
  facebook: "bg-[#4267B2] text-white",
  github: "bg-[#24292e] text-white",
  twitter: "bg-[#1DA1F2] text-white"
};

const providerNames = {
  google: "Google",
  facebook: "Facebook",
  github: "GitHub",
  twitter: "Twitter"
};

interface SocialAuthButtonProps {
  provider: SocialProvider;
  onPress: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
}

export function SocialAuthButton({ 
  provider, 
  onPress, 
  isLoading = false,
  isDisabled = false,
  className = ""
}: SocialAuthButtonProps) {
  const Icon = providerIcons[provider];
  const colorClass = providerColors[provider];
  const providerName = providerNames[provider];

  return (
    <Button
      variant="flat"
      className={`w-full ${colorClass} ${className}`}
      onPress={onPress}
      isLoading={isLoading}
      isDisabled={isDisabled}
      startContent={!isLoading && <Icon className="text-xl" />}
      disableRipple={isDisabled}
    >
      Continue with {providerName}
    </Button>
  );
} 