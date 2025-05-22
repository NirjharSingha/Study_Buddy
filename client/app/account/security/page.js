"use client";

import * as React from "react";
import { SiSpringsecurity } from "react-icons/si";
import { FaKey } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import emailjs from "@emailjs/browser";
import Otp from "@/components/Otp";

export default function LoginPage() {
  const [showOtp, setShowOtp] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [confirmPass, setConfirmPass] = useState("");
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [warning, setWarning] = useState("");

  return (
    <div
      className="w-full absolute bottom-0 overflow-y-auto"
      style={{ height: "calc(100svh - 69.6px)" }}
    >
      {showOtp && <Otp setShowOtp={setShowOtp} />}
      <div className="grid grid-cols-2 w-full h-full">
        <div
          className="bg-[#444] min-h-full min-w-[50vw] max-w-[50vw] my-auto shadow flex flex-col justify-center px-8"
          style={{ height: "100%" }}
        >
          <div className="flex justify-center w-full items-center gap-1.5">
            <SiSpringsecurity className="text-white text-6xl" />
            <p className="text-white font-bold font-mono text-3xl">
              Security Settings
            </p>
          </div>
          <div className="mt-6 text-left pl-50 pr-40">
            <ul className="list-disc text-white text-xl font-[550]">
              <li>You can update your password here</li>
              <li>We have two-step authentication system activated here</li>
              <li>We'll send a verification OTP to your mail</li>
              <li>You need to verify the otp before it expires</li>
            </ul>
          </div>
        </div>
        <div className="bg-white min-h-full min-w-[50vw] max-w-[50vw] mx-auto my-auto shadow-xl rounded-xl py-10 flex flex-col space-y-6 px-40 justify-center">
          {/* Header */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center gap-3">
              <FaKey className="text-5xl" />
              <p className="font-bold font-mono text-3xl">Manage Password</p>
            </div>
            {warning && (
              <p className="text-sm text-red-600 text-center font-medium">
                {warning}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-1">
            <Label htmlFor="password" className="text-sm font-semibold">
              New Password
            </Label>
            <div className="flex items-center border rounded-xl px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-gray-500">
              <input
                id="password"
                name="password"
                type={showNewPass ? "text" : "password"}
                className="flex-1 bg-transparent outline-none text-sm"
                placeholder="Enter new password"
                value={newPass}
                required
                onChange={(e) => {
                  setWarning("");
                  setNewPass(e.target.value);
                }}
              />
              {showNewPass ? (
                <AiFillEyeInvisible
                  className="w-6 h-6 text-gray-600 cursor-pointer"
                  onClick={() => setShowNewPass((prev) => !prev)}
                />
              ) : (
                <AiFillEye
                  className="w-6 h-6 text-gray-600 cursor-pointer"
                  onClick={() => setShowNewPass((prev) => !prev)}
                />
              )}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <Label htmlFor="cpassword" className="text-sm font-semibold">
              Confirm Password
            </Label>
            <div className="flex items-center border rounded-xl px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-gray-500">
              <input
                id="cpassword"
                name="cpassword"
                type={showConfirmPass ? "text" : "password"}
                className="flex-1 bg-transparent outline-none text-sm"
                placeholder="Confirm new password"
                value={confirmPass}
                required
                onChange={(e) => {
                  setWarning("");
                  setConfirmPass(e.target.value);
                }}
              />
              {showConfirmPass ? (
                <AiFillEyeInvisible
                  className="w-6 h-6 text-gray-600 cursor-pointer"
                  onClick={() => setShowConfirmPass((prev) => !prev)}
                />
              ) : (
                <AiFillEye
                  className="w-6 h-6 text-gray-600 cursor-pointer"
                  onClick={() => setShowConfirmPass((prev) => !prev)}
                />
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              className="w-full py-2 text-white font-semibold rounded-md transition"
              onClick={async () => {
                if (newPass === "" || confirmPass === "") {
                  setWarning("Please fill all the fields");
                  return;
                }
                if (newPass !== confirmPass) {
                  setWarning("New password and confirm password do not match");
                  return;
                }
                const id = jwtDecode(localStorage.getItem("token")).sub;
                const data = {
                  id: id,
                  name: "",
                  password: newPass,
                };
                try {
                  const otp = Math.floor(
                    100000 + Math.random() * 900000
                  ).toString();
                  emailjs
                    .send(
                      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
                      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
                      {
                        to_name: "User",
                        to_email: id,
                        message: `OTP ${otp}`,
                      },
                      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
                    )
                    .then(
                      async () => {
                        const res = await axios.post(
                          `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/saveOtp`,
                          {
                            userEmail: id,
                            otp: otp,
                            type: "UPDATE_PASSWORD",
                          }
                        );
                        if (res.status === 200) {
                          const otpObject = {
                            signupDto: data,
                            timestamp: new Date().getTime(),
                            type: "UPDATE_PASSWORD",
                          };
                          localStorage.setItem(
                            "otpObject",
                            JSON.stringify(otpObject)
                          );
                          setShowOtp(true);
                        }
                      },
                      (error) => {
                        console.log("Error:", error);
                        setWarning("This email doesn't exist");
                      }
                    );
                } catch (error) {
                  console.log("Error:", error);
                }
              }}
            >
              Send OTP
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
