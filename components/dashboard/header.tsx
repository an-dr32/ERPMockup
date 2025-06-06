"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  RiMenuLine,
  RiUserLine,
  RiLogoutBoxLine,
  RiMoonLine,
  RiSunLine,
  RiPaletteLine,
  RiUserSettingsLine
} from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";
import ProfileModal from "@/components/profile/profile-modal";
import SettingsModal from "@/components/settings/settings-modal";
import ThemeModal from "@/components/customization/theme-modal";
import { useCompany } from "@/components/context/company-context";


interface HeaderProps {
  onToggleSidebar: () => void;
  currentScreen: string;
  userName: string;
}

export default function Header({ onToggleSidebar, currentScreen, userName }: HeaderProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [currentUserName, setCurrentUserName] = useState(userName);
  const [userAvatar, setUserAvatar] = useState("");
  const { companyName, companyLogo } = useCompany();


  console.log("Header rendered", { currentScreen, userName, theme });

  const handleLogout = () => {
    console.log("User logout initiated");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    router.push("/auth/login");
  };

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    console.log("Theme toggle:", newTheme);
    setTheme(newTheme);
  };

  const handleSettings = () => {
    console.log("Settings clicked");
    setSettingsOpen(true);
  };

  const handleProfile = () => {
    console.log("Profile clicked");
    setProfileOpen(true);
  };

  const handleCustomization = () => {
    console.log("Customization clicked");
    setThemeOpen(true);
  };

  const handleProfileUpdate = (name: string, avatar?: string) => {
    setCurrentUserName(name);
    if (avatar) {
      setUserAvatar(avatar);
    }
    console.log("Profile updated", { name, avatar });
  };

  const getScreenDisplayName = (screen: string) => {
    const screenNames: Record<string, string> = {
      dashboard: "Dashboard",
      "admin-products": "Admin - Products",
      "admin-users": "Admin - Users",
      "admin-customers": "Admin - Customers",
      "admin-vendors": "Admin - Vendors",
      "admin-dimensions": "Admin - Dimensions",
      "admin-company": "Admin - Company Info",
      agronomy: "Agronomy",
      energy: "Energy",
      "food-products": "Food Products",
      grains: "Grains",
      operations: "Operations",
    };
    return screenNames[screen] || screen;
  };

  return (
    <header className="erp-header fixed top-0 left-0 w-full h-16 flex items-center px-4 z-50 bg-background shadow">
      {/* Left: Hamburger and screen name */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="p-2"
        >
          <RiMenuLine className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">
          {getScreenDisplayName(currentScreen)}
        </h1>
      </div>

      {/* Center: Logo */}
      <div className="flex items-center justify-center flex-1 px-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-erp-primary rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">ERP</span>
          </div>
          <span className="text-xl font-bold text-foreground">{companyName}</span>
          {companyLogo && <img src={companyLogo} alt="Logo" className="h-8 w-8 ml-2" />}
        </div>
      </div>

      {/* Right: User and menu */}
      <div className="flex items-center justify-end space-x-4">
        <span className="text-sm text-muted-foreground">
          Hi, {currentUserName}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatar || "/placeholder-avatar.jpg"} alt={currentUserName} />
                <AvatarFallback className="bg-erp-primary text-white">
                  {currentUserName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{currentUserName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {localStorage.getItem("userEmail")}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleProfile}>
              <RiUserLine className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleSettings}>
              <RiUserSettingsLine className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleCustomization}>
              <RiPaletteLine className="mr-2 h-4 w-4" />
              <span>Customize Theme</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleThemeToggle}>
              {theme === "dark" ? (
                <RiSunLine className="mr-2 h-4 w-4" />
              ) : (
                <RiMoonLine className="mr-2 h-4 w-4" />
              )}
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout}>
              <RiLogoutBoxLine className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        userName={currentUserName}
        userEmail={localStorage.getItem("userEmail") || ""}
        onUpdate={handleProfileUpdate}
      />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <ThemeModal
        isOpen={themeOpen}
        onClose={() => setThemeOpen(false)}
      />
    </header>
  );
}