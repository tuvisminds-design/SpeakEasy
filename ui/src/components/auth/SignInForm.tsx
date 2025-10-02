import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeftIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useAuth } from "../../context/AuthContext";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { sendOTP, verifyOTP } = useAuth();
  const navigate = useNavigate();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await sendOTP(email);
      setSuccess("OTP sent to your email address");
      setStep('otp');
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await verifyOTP(email, otp);
      navigate("/");
    } catch (error) {
      setError(error instanceof Error ? error.message : "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setOtp("");
    setError("");
    setSuccess("");
  };

  if (step === 'otp') {
    return (
      <div className="flex flex-col flex-1">
        <div className="w-full max-w-md pt-10 mx-auto">
          <button
            onClick={handleBackToEmail}
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon className="size-5" />
            Back to email
          </button>
        </div>
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Verify OTP
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter the 4-digit code sent to {email}
              </p>
            </div>
            <div>
              <form onSubmit={handleVerifyOTP}>
                <div className="space-y-6">
                  {error && (
                    <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                      {success}
                    </div>
                  )}

                  <div>
                    <Label>
                      OTP Code <span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="1234"
                      maxLength={4}
                      required
                      className="text-center text-lg tracking-widest"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      For demo purposes, use: 1234
                    </p>
                  </div>

                  <div>
                    <Button 
                      type="submit"
                      className="w-full" 
                      size="sm"
                      disabled={isLoading || otp.length !== 4}
                    >
                      {isLoading ? "Verifying..." : "Verify OTP"}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Let's Get Started
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email to receive a verification code
            </p>
          </div>
          <div>
            <form onSubmit={handleSendOTP}>
              <div className="space-y-6">
                {error && (
                  <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                    {error}
                  </div>
                )}

                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <Input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kulkarni.madhwaraj@gmail.com" 
                    required
                  />
                </div>

                <div>
                  <Button 
                    type="submit"
                    className="w-full" 
                    size="sm"
                    disabled={isLoading || !email}
                  >
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400">
                We'll send a verification code to your email address
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}