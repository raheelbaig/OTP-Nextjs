"use client";

import { auth } from "@/firebase";
import {
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Image from "next/image";
import loader from "@/public/loading.svg";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./ui/input-otp";

function OtpLogin() {
    const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<String | null>(null);
  const [success, setSuccess] = useState("");
  const [ResendCountdown, setResendCountdown] = useState(0);
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (ResendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(ResendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [ResendCountdown]);

  useEffect(() => {
    const recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      }
    );

    setRecaptchaVerifier(recaptchaVerifier);

    return () => {
      recaptchaVerifier.clear();
    };
  }, [auth]);

  useEffect(() => {
    const hasEnteredAllDigits = otp.length === 6;
    if (hasEnteredAllDigits) {
      verifyOtp();
    }
  }, [otp]);

  const verifyOtp = async () => {
    startTransition(async () => {
      setError("");

      if (!confirmationResult) {
        setError("Please request OTP first.");
        return;
      }

      try {
        await confirmationResult?.confirm(otp);
        router.replace("/")
      } catch (err) {
        console.log(err)
        setError("Failed to verify OTP, Please check the OTP.")
      }
    });
  };

  const requestOtp = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    setResendCountdown(60);

    startTransition(async () => {
      setError("");

      if (!recaptchaVerifier) {
        return setError("RecaptchaVerifier is not initialized");
      }

      try {
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          phoneNumber,
          recaptchaVerifier
        );
        setConfirmationResult(confirmationResult);
        setSuccess("OTP sent Successfully.");
      } catch (error: any) {
        console.log(error);
        setResendCountdown(0);

        if (error.code === "auth/invalid-phone-number") {
          setError("Invalid phone number, Please check the number.");
        } else if (error.code === "auth/too-many-requests") {
          setError("Too many request, Please try again later.");
        } else {
          setError("Failed to send OTP, Please try again.");
        }
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {!confirmationResult && (
        <form onSubmit={requestOtp}>
          <Input
            className="text-black"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-2">
            Please enter your number with the country code (i.e. +92 for
            Pakistan)
          </p>
        </form>
      )}

      {confirmationResult && (
        <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      )}

      <Button
        disabled={!phoneNumber || isPending || ResendCountdown > 0}
        onClick={() => {
          requestOtp();
        }}
        className="mt-5"
      >
        {ResendCountdown > 0
          ? `Resend OTP in ${ResendCountdown}`
          : isPending
          ? "Sending OTP"
          : "Send OTP"}
      </Button>

      <div className="p-10 text-center">
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </div>

      <div id="recaptcha-container" />
      {isPending && (
        <Image src={loader} width={100} height={100} alt="loader" />
      )}
    </div>
  );
}

export default OtpLogin;
