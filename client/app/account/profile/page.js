// app/profile/page.js
"use client";

import styles from "./ProfilePage.module.css";
import { MdEdit } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaCamera } from "react-icons/fa";
import { useGlobals } from "@/contexts/Globals";
import Loading from "@/components/Loading";

const UserData = ({ label, value, flag, setValue, setWarning, isEditing }) => {
  return (
    <div className={styles.detail}>
      <strong>
        {label}:{flag && <span className="text-red-500">*</span>}
      </strong>
      {!isEditing && (
        <p
          className={`${value === null || value === "" ? "text-gray-500" : ""}`}
        >
          {value === null || value === "" ? "Not filled" : value}
        </p>
      )}
      {isEditing && (
        <input
          type="text"
          className="w-full outline-none font-sans cursor-pointer"
          placeholder={`Enter ${label.toLowerCase()}`}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setWarning("");
          }}
        />
      )}
    </div>
  );
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [imgStream, setImgStream] = useState("");
  const [warning, setWarning] = useState("");
  const [showLoading, setShowLoading] = useState(true);
  const fileInputRef = useRef(null);
  const { setToastMessage } = useGlobals();

  const getProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      setShowLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/getUser?userId=${
          token !== null ? jwtDecode(token).sub : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setShowLoading(false);
        setName(response.data.name);
        setPhone(response.data.mobile !== null ? response.data.mobile : "");
        setAddress(response.data.address !== null ? response.data.address : "");
        setId(response.data.id);
        setAge(response.data.age !== null ? response.data.age : "");
        setGender(response.data.gender !== null ? response.data.gender : "");
        if (response.data.profilePic !== null) {
          setImgStream(`data:image/jpeg;base64,${response.data.profilePic}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setWarning("");

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImgStream(reader.result);
    };
  };

  const handleUpdateProfile = async () => {
    if (name === "") {
      setWarning("Username cannot be empty");
      return;
    }

    const formData = new FormData();
    formData.append("id", jwtDecode(localStorage.getItem("token")).sub);
    formData.append("name", name);
    formData.append("address", address);
    formData.append("mobile", phone);
    formData.append("age", age);
    formData.append("gender", gender);
    formData.append("file", profilePic);

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/user/updateProfile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status == 200) {
        setWarning("");
        setToastMessage("Profile updated successfully");
        setIsEditing(false);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <>
      {showLoading && (
        <div className="w-[100vw] h-[100svh] flex justify-center items-center">
          <Loading />
        </div>
      )}
      {!showLoading && (
        <form
          className={styles.profilePage}
          encType="multipart/form-data"
          style={{ height: "calc(100svh - 69.6px)", overflowY: "auto" }}
        >
          <div className={styles.profileContainer}>
            <div className={styles.profileHeader}>
              <div className={`relative ${isEditing ? "" : "mr-5"}`}>
                {imgStream !== "" ? (
                  <img
                    src={imgStream}
                    alt="User Profile"
                    className={styles.profileImage}
                  />
                ) : (
                  <div className={styles.profileImage} />
                )}
                {isEditing && (
                  <span
                    className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 p-[5px] rounded-full bg-white border-[1px] border-black cursor-pointer"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <FaCamera className="text-gray-700 text-[1.1rem]" />
                  </span>
                )}
                <input
                  className="hidden"
                  type="file"
                  id="profilePic"
                  name="profilePic"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
              {!isEditing && (
                <div className={styles.profileInfo}>
                  <h1>{id}</h1>
                  <p className={styles.profession}>{name}</p>
                </div>
              )}
            </div>
            <div className={styles.profileDetails}>
              <p className="text-center mb-[6px] text-red-500">{warning}</p>
              <div className={styles.detail}>
                <strong>
                  User ID:{isEditing && <span className="text-red-500">*</span>}
                </strong>
                <p style={isEditing ? { cursor: "not-allowed" } : {}}>{id}</p>
              </div>
              <UserData
                label="Name"
                value={name}
                flag={isEditing}
                setValue={setName}
                setWarning={setWarning}
                isEditing={isEditing}
              />
              <UserData
                label="Phone"
                value={phone}
                flag={false}
                setValue={setPhone}
                setWarning={setWarning}
                isEditing={isEditing}
              />
              <UserData
                label="Address"
                value={address}
                flag={false}
                setValue={setAddress}
                setWarning={setWarning}
                isEditing={isEditing}
              />
              <div
                className={styles.detail}
                style={isEditing ? { borderBottom: "0px" } : {}}
              >
                <strong>Gender:</strong>
                {!isEditing && (
                  <p
                    className={`${
                      gender === null || gender === "" ? "text-gray-500" : ""
                    }`}
                  >
                    {gender === null || gender === "" ? "Not filled" : gender}
                  </p>
                )}
                {isEditing && (
                  <Select onValueChange={(value) => setGender(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
              <UserData
                label="Age"
                value={age}
                flag={false}
                setValue={setAge}
                setWarning={setWarning}
                isEditing={isEditing}
              />
            </div>
          </div>
          <div className={styles.updateButtonContainer}>
            <div
              className={styles.updateProfileBtn}
              onClick={() => {
                if (isEditing) {
                  handleUpdateProfile();
                } else {
                  setIsEditing(true);
                }
              }}
            >
              {isEditing ? (
                "Apply Changes"
              ) : (
                <div className="flex justify-center items-center gap-2">
                  <MdEdit className="text-xl" />
                  Update
                </div>
              )}
            </div>
          </div>
        </form>
      )}
    </>
  );
}
