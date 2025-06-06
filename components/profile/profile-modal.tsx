"use client";

import { useState, useEffect } from "react";
import { RiUserLine, RiImageLine, RiSaveLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  onUpdate: (name: string, avatar?: string) => void;
}

export default function ProfileModal({
  isOpen,
  onClose,
  userName,
  userEmail,
  onUpdate
}: ProfileModalProps) {
  const [name, setName] = useState(userName);
  const [avatarUrl, setAvatarUrl] = useState("");
  const { toast } = useToast();

  console.log("ProfileModal rendered", { isOpen, userName, userEmail });

  useEffect(() => {
    if (isOpen) {
      setName(userName);
      if (typeof window !== "undefined") {
        setAvatarUrl(localStorage.getItem("userAvatar") || "");
      }
    }
  }, [isOpen, userName]);

  const handleSave = () => {
    console.log("Saving profile", { name, avatarUrl });

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    // Add this block to prevent saving large avatars
    if (avatarUrl && avatarUrl.length > 1024 * 1024) { // 1MB limit
      toast({
        title: "Error",
        description: "Avatar image is too large. Please use a smaller image.",
        variant: "destructive",
      });
      return;
    }

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("userName", name);
    }
    if (avatarUrl) {
      if (typeof window !== "undefined") {
        localStorage.setItem("userAvatar", avatarUrl);
      }
    }

    onUpdate(name, avatarUrl);

    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated",
    });

    onClose();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          // Resize logic
          const canvas = document.createElement("canvas");
          const maxSize = 128;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/png", 0.7); // compress
          setAvatarUrl(dataUrl);
          console.log("Avatar updated and resized");
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <RiUserLine className="mr-2 h-5 w-5" />
            Profile Management
          </DialogTitle>
          <DialogDescription>
            Update your profile information and avatar.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback className="bg-erp-primary text-white text-lg">
                  {name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <label className="absolute -bottom-2 -right-2 bg-erp-primary text-white rounded-full p-2 cursor-pointer hover:bg-erp-primary-dark transition-colors">
                <RiImageLine className="h-3 w-3" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Enter your name"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={userEmail}
              disabled
              className="col-span-3 bg-muted"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="avatar-url" className="text-right">
              Avatar URL
            </Label>
            <Input
              id="avatar-url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="col-span-3"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-erp-primary hover:bg-erp-primary-dark">
            <RiSaveLine className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}