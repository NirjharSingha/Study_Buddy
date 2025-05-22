"use client";

import React, { useEffect, useState } from "react";
import OtpInput from "./OtpInput";
import { Button } from "@/components/ui/button";
import { CgPassword } from "react-icons/cg";
import { useGlobals } from "@/contexts/Globals";
import axios from "axios";
import { useRouter } from "next/navigation";

const Otp = ({ setShowOtp }) => {
  const { setToastMessage } = useGlobals();
  const [warning, setWarning] = useState("");
  const [otp, setOtp] = useState("");
  const [timeCount, setTimeCount] = useState(180);
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const otpObject = JSON.parse(localStorage.getItem("otpObject"));
    if (otpObject) {
      if (
        otpObject.type === "REGISTER" ||
        otpObject.type === "UPDATE_PASSWORD"
      ) {
        setEmail(otpObject.signupDto.id);
      } else if (otpObject.type === "FORGOT_PASSWORD") {
        setEmail(otpObject.id);
      }

      // Calculate the time difference between now and the timestamp
      const currentTime = new Date().getTime();
      const timeElapsed = (currentTime - otpObject.timestamp) / 1000; // in seconds

      // Calculate the remaining time
      const remainingTime = 180 - timeElapsed;
      if (remainingTime > 0) {
        setTimeCount(remainingTime);
      } else {
        // If the OTP has expired, clear the local storage
        localStorage.removeItem("otpObject");
        setShowOtp(false);
      }
    }

    const interval = setInterval(() => {
      setTimeCount((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeCount <= 0) {
      setShowOtp(false);
      localStorage.removeItem("otpObject");
    }
  }, [timeCount]);

  const handleCancel = () => {
    localStorage.removeItem("otpObject");
    setShowOtp(false);
  };

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      setWarning("Please enter a valid otp");
      return;
    }

    const otpObject = JSON.parse(localStorage.getItem("otpObject"));
    let dataToSend, username, password;
    const { signupDto } = otpObject;

    if (otpObject !== undefined && otpObject !== null) {
      dataToSend = {
        userEmail:
          otpObject.type === "REGISTER"
            ? signupDto.id
            : otpObject.type === "FORGOT_PASSWORD"
            ? otpObject.id
            : signupDto.id,
        otp: otp,
        type: otpObject.type,
      };

      if (
        otpObject.type === "REGISTER" ||
        otpObject.type === "UPDATE_PASSWORD"
      ) {
        username = signupDto.name;
        password = signupDto.password;
      }
    }

    try {
      let response;
      if (
        otpObject.type === "REGISTER" ||
        otpObject.type === "UPDATE_PASSWORD"
      ) {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/verifyOtp?username=${username}&password=${password}`,
          dataToSend
        );
      } else if (otpObject.type === "FORGOT_PASSWORD") {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/forgotPassword`,
          dataToSend
        );
      }
      if (response.status === 200) {
        if (otpObject.type === "UPDATE_PASSWORD") {
          setToastMessage("Password updated successfully");
          router.push("/account");
          setShowOtp(false);
          localStorage.removeItem("otpObject");
          return;
        }
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        setToastMessage("OTP verification successfully");
        setShowOtp(false);
        localStorage.removeItem("otpObject");
        router.push("/");
      }
    } catch (error) {
      console.log("Error:", error);
      if (error.response.status === 401) {
        setWarning(error.response.data.error);
      }
    }
  };

  return (
    <div className="absolute top-0 left-0 w-[100vw] h-[100svh] bg-slate-200 bg-opacity-70 z-[500] flex justify-center items-center">
      <div
        encType="multipart/form-data"
        className="w-full max-w-[370px] rounded bg-white shadow-md shadow-gray-500 max-h-[100svh] overflow-y-auto"
      >
        <div className="w-full h-[2.3rem] bg-slate-500 flex items-center justify-end rounded-t">
          <div
            className="font-bold text-sm text-white h-[1.8rem] w-[1.8rem] mr-2 hover:bg-red-600 hover:rounded-full flex justify-center items-center cursor-pointer"
            onClick={handleCancel}
          >
            X
          </div>
        </div>
        <div className="mt-2 mb-2 flex flex-col items-center">
          <div className="flex justify-center items-center rounded-lg">
            <CgPassword className="text-[2.8rem] text-gray-700 mr-2" />
            <p className="font-serif text-[1.5rem] font-bold text-gray-700">
              OTP
            </p>
          </div>
          <p className="p-2 pt-0 font-serif text-[0.92rem]">{`An email with verification otp is sent to your mail ${email}. The otp will expire in next 3 minutes.\nPlease enter the otp to verify your email.`}</p>
          <p className="font-sans text-sm text-red-600 w-full text-center mt-2 mb-3">
            {warning}
          </p>
          <OtpInput otp={otp} setOtp={setOtp} />
          <p className="mt-2 font-bold text-[0.92rem] font-sans">
            {`Otp expires in ${timeCount.toFixed(0)} seconds`}
          </p>
          <div className="px-3 w-full" onClick={handleSubmit}>
            <Button className="mt-2 mb-2 w-full text-sm font-bold cursor-pointer">
              Verify OTP
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Otp;
