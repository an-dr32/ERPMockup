"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RiArrowLeftLine, RiRefreshLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";

export default function VerifyCodeForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isLoading, setIsLoading] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  console.log("VerifyCodeForm component rendered", { code, timeLeft, isExpired });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          console.log("Verification code expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isExpired) {
      toast({
        variant: "destructive",
        title: "Code expired",
        description: "Please request a new verification code",
      });
      return;
    }

    console.log("Verify code form submitted", { code });
    setIsLoading(true);

    // Simulate code verification
    setTimeout(() => {
      if (code === "12345") {
        console.log("Code verified successfully");
        toast({
          title: "Code verified",
          description: "Redirecting to password reset",
        });
        router.push("/auth/new-password");
      } else {
        console.log("Invalid code");
        toast({
          variant: "destructive",
          title: "Invalid code",
          description: "Please check the code and try again",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleResendCode = () => {
    console.log("Resending verification code");
    setTimeLeft(120);
    setIsExpired(false);
    setCode("");
    toast({
      title: "Code sent",
      description: "A new verification code has been sent to your email",
    });
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Enter Verification Code
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          We've sent a 5-digit code to your email address
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex justify-center">
            <InputOTP 
              maxLength={5} 
              value={code} 
              onChange={(value) => {
                console.log("OTP changed:", value);
                setCode(value);
              }}
              disabled={isExpired}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="text-center">
            {isExpired ? (
              <p className="text-sm text-red-600 dark:text-red-400">
                Verification code has expired
              </p>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Code expires in {formatTime(timeLeft)}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-erp-primary hover:bg-erp-primary-dark text-white"
          disabled={isLoading || code.length !== 5 || isExpired}
        >
          {isLoading ? "Verifying..." : "Verify Code"}
        </Button>

        <div className="flex flex-col space-y-2 text-center">
          <button
            type="button"
            onClick={handleResendCode}
            className="inline-flex items-center justify-center text-sm text-erp-primary hover:text-erp-primary-dark transition-colors"
            disabled={!isExpired && timeLeft > 60}
          >
            <RiRefreshLine className="w-4 h-4 mr-1" />
            Resend code
          </button>
          
          <button
            type="button"
            onClick={() => router.push("/auth/reset-password")}
            className="inline-flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <RiArrowLeftLine className="w-4 h-4 mr-1" />
            Back
          </button>
        </div>
      </form>

      <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
        Demo code: 12345
      </div>
    </div>
  );
}