import LoginForm from "@/components/auth/login-form";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Login form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white dark:bg-gray-900">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <LoginForm />
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-erp-primary/90 to-erp-primary-dark/90" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1658902748005-4a1c2ca3e148?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")'
          }}
        />
        <div className="absolute left-0 right-0 top-60">
          <div className="text-center text-white">
            {/* Company Logo */}
            <img
              src="https://hensallco-op.ca/images/logo.png" // <-- Replace with your logo path or URL
              alt="Company Logo"
              style={{ height: 110, width: 450, filter: "drop-shadow(0 1px 4px rgba(32, 32, 32, 0.71))" }}
              className="mx-auto mb-6 object-contain"
            />
            <p className="text-2xl font-semibold opacity-90 drops-shadow-2xl text-[hsl(var(--background))]">Streamline your business operations</p>
          </div>
        </div>
      </div>
    </div>
  );
}