"use client";

import React, { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function OtpInput({ otp, setOtp }) {
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);

  const handleChange = (index, value) => {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Combine the values into a single OTP string
    const otp = newOtpValues.join("");
    setOtp(otp);
  };

  return (
    <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
      <InputOTPGroup>
        {[0, 1, 2].map((index) => (
          <InputOTPSlot
            key={index}
            index={index}
            value={otpValues[index]}
            onChange={(e) => handleChange(index, e.target.value)}
          />
        ))}
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        {[3, 4, 5].map((index) => (
          <InputOTPSlot
            key={index}
            index={index}
            value={otpValues[index]}
            onChange={(e) => handleChange(index, e.target.value)}
          />
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}
