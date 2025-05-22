"use client";

import "./style.css";
import { useState, useEffect } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { BiLogIn } from "react-icons/bi";
import { TbLogin } from "react-icons/tb";
import Image from "next/image";
import LoginImage from "@/public/log.svg";
import RegImage from "@/public/register.svg";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import emailjs from "@emailjs/browser";
import Otp from "@/components/Otp";
import { useRouter } from "next/navigation";
import { useGlobals } from "@/contexts/Globals";

export default function Home() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { setToastMessage } = useGlobals();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [warning, setWarning] = useState("");
  const [id, setId] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  const resetValues = () => {
    setId("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setWarning("");
    setShowPass(false);
    setShowConfirmPassword(false);
  };

  useEffect(() => {
    setMounted(true); // Ensures component renders only after client-side load
    const otpObject = JSON.parse(localStorage.getItem("otpObject"));
    if (otpObject !== undefined && otpObject !== null) {
      setShowOtp(true);
    }
  }, []);

  // If not mounted, don’t add the dynamic class
  const containerClass = mounted
    ? `container ${isSignUpMode ? "sign-up-mode" : ""}`
    : "container";

  const handleGoogleAuth = async (details) => {
    const postData = {
      id: details.email,
      name: details.given_name,
    };
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/googleAuth`,
        postData
      );
      if (response.status == 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        setToastMessage("Google authentication successful");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setWarning("Passwords do not match");
      return;
    }

    const postData = {
      id: id,
      name: username,
      password: password,
      role: "USER",
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/signup`,
        postData
      );
      if (response.status == 200) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        emailjs
          .send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
            {
              to_name: username,
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
                  type: "REGISTER",
                }
              );
              if (res.status === 200) {
                const otpObject = {
                  signupDto: postData,
                  timestamp: new Date().getTime(),
                  type: "REGISTER",
                };
                localStorage.setItem("otpObject", JSON.stringify(otpObject));
                setShowOtp(true);
              }
            },
            (error) => {
              console.log("Error:", error);
              setWarning("This email doesn't exist");
            }
          );
      }
    } catch (error) {
      console.log(error);
      setWarning(`Duplicate email`);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!id.includes("@")) {
      setWarning("Invalid email");
      return;
    }

    const postData = {
      id: id,
      password: password,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`,
        postData
      );
      if (response.status == 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        setToastMessage("Signed in successfully");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      setWarning("Invalid credentials");
    }
  };

  const handleForgetPassword = async () => {
    if (id === "") {
      setWarning("Please enter your email to get the OTP");
      return;
    }
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
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
                type: "FORGOT_PASSWORD",
              }
            );
            if (res.status === 200) {
              const otpObject = {
                id: id,
                timestamp: new Date().getTime(),
                type: "FORGOT_PASSWORD",
              };
              localStorage.setItem("otpObject", JSON.stringify(otpObject));
              setShowOtp(true);
            }
          },
          (error) => {
            console.log("Error:", error);
            setWarning("This email doesn't exist");
          }
        );
    } catch (error) {
      console.log(error);
      setWarning(`Duplicate email`);
    }
  };

  return (
    <>
      {showOtp && <Otp setShowOtp={setShowOtp} />}
      <div className={containerClass}>
        <div className="forms-container">
          <div className="signin-signup">
            <form onSubmit={handleLogin} className="sign-in-form">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row-reverse",
                  alignItems: "center",
                }}
              >
                <p className="title">Sign in</p>
                <TbLogin
                  style={{
                    fontSize: "40px",
                    marginBottom: "10px",
                    marginRight: "5px",
                  }}
                />
              </div>
              <div className="input-field">
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={id}
                  required
                  onChange={(e) => {
                    setId(e.target.value);
                    setWarning("");
                  }}
                />
                <MdEmail
                  className="cursor-pointer text-gray-700"
                  style={{ fontSize: "22px" }}
                />
              </div>
              <div className="input-field">
                <input
                  type={!showPass ? "password" : "text"}
                  placeholder="Enter Password"
                  value={password}
                  required
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setWarning("");
                  }}
                />
                {!showPass && (
                  <AiFillEye
                    className="cursor-pointer text-gray-700"
                    style={{ fontSize: "24px", cursor: "pointer" }}
                    onClick={() => setShowPass(true)}
                  />
                )}
                {showPass && (
                  <AiFillEyeInvisible
                    className="cursor-pointer text-gray-700"
                    style={{ fontSize: "24px", cursor: "pointer" }}
                    onClick={() => setShowPass(false)}
                  />
                )}
              </div>
              <p className="w-full text-center my-1" style={{ color: "red" }}>
                {warning}
              </p>
              <span
                className="w-full text-center my-1 hover:underline"
                style={{
                  color: "green",
                  cursor: "pointer",
                }}
                onClick={handleForgetPassword}
              >
                Forget password? Click here
              </span>
              <input
                type="submit"
                value="Sign in"
                className="px-6 py-[6px] cursor-pointer hover:bg-blue-700 rounded-full bg-blue-500 text-white font-bold mt-2"
              />
              {mounted && (
                <div className="mt-4 w-full flex justify-center items-center">
                  <GoogleOAuthProvider
                    clientId={process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID}
                  >
                    <GoogleLogin
                      onSuccess={(credentialResponse) => {
                        const details = jwtDecode(
                          credentialResponse.credential
                        );
                        console.log(details);
                        handleGoogleAuth(details);
                      }}
                      onError={() => {
                        console.log("Login Failed");
                      }}
                    />
                  </GoogleOAuthProvider>
                </div>
              )}
            </form>
            <form onSubmit={handleSignUp} className="sign-up-form">
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <p className="title">Sign up</p>
                <BiLogIn style={{ fontSize: "40px", marginBottom: "10px" }} />
              </div>
              <div className="input-field">
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={id}
                  required
                  onChange={(e) => {
                    setId(e.target.value);
                    setWarning("");
                  }}
                />
                <MdEmail
                  className="cursor-pointer text-gray-700"
                  style={{ fontSize: "22px" }}
                />
              </div>
              <div className="input-field">
                <input
                  type="text"
                  placeholder="Enter Username"
                  value={username}
                  required
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setWarning("");
                  }}
                />
                <FaUser
                  className="cursor-pointer text-gray-700"
                  style={{ fontSize: "20px" }}
                />
              </div>
              <div className="input-field">
                <input
                  type={!showPass ? "password" : "text"}
                  placeholder="Enter Password"
                  value={password}
                  required
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setWarning("");
                  }}
                />
                {!showPass && (
                  <AiFillEye
                    className="cursor-pointer text-gray-700"
                    style={{ fontSize: "24px", cursor: "pointer" }}
                    onClick={() => setShowPass(true)}
                  />
                )}
                {showPass && (
                  <AiFillEyeInvisible
                    className="cursor-pointer text-gray-700"
                    style={{ fontSize: "24px", cursor: "pointer" }}
                    onClick={() => setShowPass(false)}
                  />
                )}
              </div>
              <div className="input-field">
                <input
                  type={!showConfirmPassword ? "password" : "text"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  required
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setWarning("");
                  }}
                />
                {!showConfirmPassword && (
                  <AiFillEye
                    className="cursor-pointer text-gray-700"
                    style={{ fontSize: "24px", cursor: "pointer" }}
                    onClick={() => setShowConfirmPassword(true)}
                  />
                )}
                {showConfirmPassword && (
                  <AiFillEyeInvisible
                    className="cursor-pointer text-gray-700"
                    style={{ fontSize: "24px", cursor: "pointer" }}
                    onClick={() => setShowConfirmPassword(false)}
                  />
                )}
              </div>
              <p className="w-full text-center my-1" style={{ color: "red" }}>
                {warning}
              </p>
              <input
                type="submit"
                className="px-6 py-[6px] cursor-pointer hover:bg-blue-700 rounded-full bg-blue-500 text-white font-bold mt-2"
                value="Sign up"
              />
              {mounted && (
                <div className="mt-4 w-full flex justify-center items-center">
                  <GoogleOAuthProvider
                    clientId={process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID}
                  >
                    <GoogleLogin
                      onSuccess={(credentialResponse) => {
                        const details = jwtDecode(
                          credentialResponse.credential
                        );
                        console.log(details);
                        handleGoogleAuth(details);
                      }}
                      onError={() => {
                        console.log("Login Failed");
                      }}
                    />
                  </GoogleOAuthProvider>
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>New here ?</h3>
              <p>
                You have to create an account first in order to start your
                journey with us
              </p>
              <button
                className="btn transparent"
                onClick={() => {
                  resetValues();
                  setIsSignUpMode(true);
                }}
              >
                Sign up
              </button>
            </div>
            <Image src={RegImage} alt="reg" className="image" />
          </div>
          <div className="panel right-panel">
            <div className="content">
              <h3>One of us ?</h3>
              <p>
                You can sign in with your existing account and resume your
                journey with us
              </p>
              <button
                className="btn transparent"
                onClick={() => {
                  resetValues();
                  setIsSignUpMode(false);
                }}
              >
                Sign in
              </button>
            </div>
            <Image src={LoginImage} alt="log" className="image" />
          </div>
        </div>
      </div>
    </>
  );
}
