"use client";

import styles from "@/styles/HotelPage.module.css";
import { useState, useRef } from "react";
import axios from "axios";
import { useGlobals } from "@/contexts/Globals";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { IoMdAddCircle } from "react-icons/io";
import { jwtDecode } from "jwt-decode";

export const UserData = ({ label, value, flag, setValue, setWarning }) => {
  return (
    <div className={styles.detail}>
      <strong>
        {label}:{<span className="text-red-500">*</span>}
      </strong>
      <input
        type={flag ? "number" : "text"}
        className="w-full outline-none font-sans cursor-pointer"
        placeholder={`Enter ${label.toLowerCase()}`}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setWarning("");
        }}
      />
    </div>
  );
};

const AddVideoDialog = ({ dialogRef, isEdit, video, setReloadFlag }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [warning, setWarning] = useState("");
  const fileInputRef = useRef(null);
  const { setToastMessage } = useGlobals();
  const [isEditing] = useState(false);
  const [newAttachments, setNewAttachments] = useState([]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    const filesArray = Array.from(files);
    setNewAttachments((prevFiles) => [...prevFiles, ...filesArray]);
  };

  const handleSubmit = async () => {
    if (name === "" || category === "" || description === "") {
      setWarning("Fill necessary information");
      return;
    }

    const formData = new FormData();
    formData.append("title", name);
    formData.append("tag", category);
    formData.append("content", description);
    formData.append("type", "Video");
    formData.append("author", jwtDecode(localStorage.getItem("token")).sub);
    if (!isEdit) {
      newAttachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    if (isEdit) {
      formData.append("id", video.id);
      formData.append("attachments", []);
    }

    try {
      let response;
      if (!isEdit) {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/resources/addArticle`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/resources/updateVideo`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
      if (response.status == 200) {
        setWarning("");
        if (!isEdit) {
          setToastMessage("Video added successfully");
        } else {
          setToastMessage("Video updated successfully");
        }
        setReloadFlag((prev) => !prev);
        dialogRef.current.click();
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="hidden"
          ref={dialogRef}
          onClick={() => {
            setTimeout(() => {
              if (!isEdit) {
                setNewAttachments([]);
                setName("");
                setCategory("");
                setDescription("");
              } else {
                setNewAttachments(video.files);
                setName(video.title);
                setCategory(video.tag);
                setDescription(video.content);
              }
            }, 100);
          }}
        >
          Edit
        </button>
      </DialogTrigger>
      <DialogTitle></DialogTitle>
      <DialogContent
        className="sm:max-w-[500px] max-h-[96svh] overflow-y-auto p-0"
        style={{ padding: 0 }}
      >
        <form style={{ padding: 0, margin: 0 }} encType="multipart/form-data">
          <div className="w-full p-2 mt-8">
            <div className="w-full">
              <div className="w-full flex overflow-x-auto gap-2 rounded min-h-[300px] max-h-[300px] bg-gray-300 p-[6px] py-0">
                {newAttachments != null &&
                  newAttachments.map((file, index) => (
                    <video
                      key={index}
                      src={
                        !isEdit
                          ? URL.createObjectURL(file)
                          : `data:video/mp4;base64,${video.files[0].data}`
                      } // ✅ create preview URL
                      controls
                      className="cursor-pointer rounded-md w-full h-full"
                    />
                  ))}
              </div>
            </div>
            <input
              type="file"
              name="postAttachments"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/*"
            />
            {!isEdit && (
              <div
                onClick={() => fileInputRef.current.click()}
                className={`ml-auto flex font-sans text-gray-700 px-3 py-2 rounded-full shadow-md shadow-gray-400 bg-slate-200 hover:bg-slate-300 cursor-pointer items-center w-[10rem] mt-2`}
              >
                <IoMdAddCircle className="text-lg mr-2" />
                <p className="font-bold truncate text-sm">Add Video</p>
              </div>
            )}
            <div className={styles.profileDetails}>
              <p className="text-center mb-[6px] text-red-500">{warning}</p>
              <UserData
                label="Title"
                value={name}
                flag={false}
                setValue={setName}
                setWarning={setWarning}
                isEditing={isEditing}
              />
              <UserData
                label="Tag"
                value={category}
                flag={false}
                setValue={setCategory}
                setWarning={setWarning}
                isEditing={isEditing}
              />
              <UserData
                label="Description"
                value={description}
                flag={false}
                setValue={setDescription}
                setWarning={setWarning}
                isEditing={isEditing}
              />
            </div>
          </div>
          <div className={styles.updateButtonContainer}>
            <div
              className={styles.updateProfileBtn}
              onClick={() => {
                handleSubmit();
              }}
            >
              Submit
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVideoDialog;
