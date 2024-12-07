'use client';

import { Card, CardBody } from "@nextui-org/react";
import { 
  FaMapMarkedAlt, 
  FaChartLine, 
  FaUserFriends, 
  FaShoppingCart 
} from "react-icons/fa";

const features = [
  {
    name: 'Interactive Local Maps',
    description: 'Find nearby stores and deals with real-time GPS integration.',
    icon: FaMapMarkedAlt,
  },
  {
    name: 'Price Comparison',
    description: 'Compare prices across multiple local retailers and track historical trends.',
    icon: FaChartLine,
  },
  {
    name: 'Community Features',
    description: 'Share and discover user-submitted deals, earn rewards for participation.',
    icon: FaUserFriends,
  },
  {
    name: 'Smart Shopping Lists',
    description: 'Create and manage shopping lists with store recommendations.',
    icon: FaShoppingCart,
  },
];

export function FeaturesSection() {
  return (
    <div className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Everything you need to shop smarter
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-default-500">
            Discover amazing features that help you save time and money
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.name} className="border-none">
                <CardBody className="text-center">
                  <div className="flex justify-center">
                    <feature.icon className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="mt-6 text-xl font-medium text-foreground">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-default-500">
                    {feature.description}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 