"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RiMailLine, RiArrowLeftLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ResetPasswordForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  console.log("ResetPasswordForm component rendered", { email });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Reset password form submitted", { email });
    setIsLoading(true);

    // Simulate email verification
    setTimeout(() => {
      if (email === "admin@company.com") {
        console.log("Email found, redirecting to 2FA");
        localStorage.setItem("resetEmail", email);
        toast({
          title: "Email sent",
          description: "Check your email for the verification code",
        });
        router.push("/auth/verify-code");
      } else {
        console.log("Email not found");
        toast({
          variant: "destructive",
          title: "Email not found",
          description: "This email is not registered in our system",
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Reset Password
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Enter your email address and we'll send you a verification code
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Email address
          </Label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <RiMailLine className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="pl-10"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-erp-primary hover:bg-erp-primary-dark text-white"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send verification code"}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="inline-flex items-center text-sm text-erp-primary hover:text-erp-primary-dark transition-colors"
          >
            <RiArrowLeftLine className="w-4 h-4 mr-1" />
            Back to login
          </button>
        </div>
      </form>
    </div>
  );
}