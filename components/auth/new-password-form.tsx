"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RiEyeLine, RiEyeOffLine, RiLockLine, RiCheckboxCircleLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function NewPasswordForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  console.log("NewPasswordForm component rendered", { formData });

  const handleInputChange = (field: string, value: string) => {
    console.log("Input changed:", field, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New password form submitted", formData);

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password mismatch",
        description: "Passwords do not match",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "Password must be at least 6 characters long",
      });
      return;
    }

    setIsLoading(true);

    // Simulate password reset
    setTimeout(() => {
      console.log("Password reset successful");

      if (typeof window !== "undefined") {
        localStorage.removeItem("resetEmail");
      }
      toast({
        title: "Password reset successful",
        description: "Your password has been updated. Please login with your new password.",
      });
      router.push("/auth/login");
      setIsLoading(false);
    }, 1500);
  };

  const passwordMatch = formData.password && formData.confirmPassword &&
    formData.password === formData.confirmPassword;

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Create New Password
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Enter your new password below
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              New Password
            </Label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <RiLockLine className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="pl-10 pr-10"
                placeholder="Enter new password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <RiEyeOffLine className="h-5 w-5 text-gray-400" />
                ) : (
                  <RiEyeLine className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password
            </Label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <RiLockLine className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                className="pl-10 pr-10"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <RiEyeOffLine className="h-5 w-5 text-gray-400" />
                ) : (
                  <RiEyeLine className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {formData.confirmPassword && (
              <div className="mt-2 flex items-center text-sm">
                {passwordMatch ? (
                  <>
                    <RiCheckboxCircleLine className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600">Passwords match</span>
                  </>
                ) : (
                  <span className="text-red-600">Passwords do not match</span>
                )}
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-erp-primary hover:bg-erp-primary-dark text-white"
          disabled={isLoading || !passwordMatch || formData.password.length < 6}
        >
          {isLoading ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
}