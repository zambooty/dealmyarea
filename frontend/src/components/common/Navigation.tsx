'use client';

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Link as NextUILink,
} from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { ThemeSwitch } from "./ThemeSwitch";
import NextLink from "next/link";

export function Navigation() {
  const pathname = usePathname();
  
  const menuItems = [
    { name: "Deals", href: "/deals" },
    { name: "Map", href: "/map" },
    { name: "Price Compare", href: "/compare" },
    { name: "Community", href: "/community" },
  ];

  return (
    <Navbar
      isBordered
      isBlurred
      className="bg-background/70 backdrop-blur-lg backdrop-saturate-150"
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarContent className="pr-3" justify="center">
        <NavbarBrand>
          <NextLink href="/" passHref legacyBehavior>
            <NextUILink className="font-bold text-inherit">
              DealmyArea
            </NextUILink>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.name} isActive={pathname === item.href}>
            <NextLink href={item.href} passHref legacyBehavior>
              <NextUILink
                className={pathname === item.href ? "text-primary" : "text-foreground"}
              >
                {item.name}
              </NextUILink>
            </NextLink>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden sm:flex">
          <NextLink href="/login" passHref legacyBehavior>
            <Button
              as={NextUILink}
              color="primary"
              variant="flat"
            >
              Login
            </Button>
          </NextLink>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item) => (
          <NavbarMenuItem key={item.name}>
            <NextLink href={item.href} passHref legacyBehavior>
              <NextUILink
                className={`w-full ${
                  pathname === item.href ? "text-primary" : "text-foreground"
                }`}
                size="lg"
              >
                {item.name}
              </NextUILink>
            </NextLink>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
} 