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

const AddArticleDialog = ({ dialogRef, isEdit, article, setReloadFlag }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [warning, setWarning] = useState("");
  const fileInputRef = useRef(null);
  const { setToastMessage } = useGlobals();
  const [isEditing] = useState(false);
  const [prevAttachments, setPrevAttachments] = useState([]);
  const [newAttachments, setNewAttachments] = useState([]);
  const imageRef = useRef([]);
  const imageRef2 = useRef([]);
  const [previewFiles, setPreviewFiles] = useState([]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    const filesArray = Array.from(files);
    setNewAttachments((prevFiles) => [...prevFiles, ...filesArray]);

    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPreviewFiles((prevFiles) => [...prevFiles, reader.result]);
      };
    });
  };

  const toggleFullscreen = (imageElement) => {
    if (!document.fullscreenElement) {
      if (imageElement.requestFullscreen) {
        imageElement.requestFullscreen();
      } else if (imageElement.mozRequestFullScreen) {
        imageElement.mozRequestFullScreen();
      } else if (imageElement.webkitRequestFullscreen) {
        imageElement.webkitRequestFullscreen();
      } else if (imageElement.msRequestFullscreen) {
        imageElement.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
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
    formData.append("type", "Article");
    formData.append("author", jwtDecode(localStorage.getItem("token")).sub);
    newAttachments.forEach((file) => {
      formData.append("attachments", file);
    });

    if (isEdit) {
      formData.append("id", article.id);
      prevAttachments.forEach((file) => {
        formData.append("prevImages", file.id);
      });
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
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/resources/editArticle`,
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
          setToastMessage("Article added successfully");
        } else {
          setToastMessage("Article updated successfully");
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
                setPrevAttachments([]);
                setNewAttachments([]);
                setPreviewFiles([]);
                setName("");
                setCategory("");
                setDescription("");
              } else {
                setPrevAttachments(article.files);
                setNewAttachments([]);
                setPreviewFiles([]);
                setName(article.title);
                setCategory(article.tag);
                setDescription(article.content);
              }
            }, 100);
          }}
        >
          Edit
        </button>
      </DialogTrigger>
      <DialogTitle></DialogTitle>
      <DialogContent
        className="sm:max-w-[700px] max-h-[96svh] overflow-y-auto p-0"
        style={{ padding: 0 }}
      >
        <form style={{ padding: 0, margin: 0 }} encType="multipart/form-data">
          <div className="w-full p-2 mt-8">
            <div className="w-full">
              <div className="w-full flex overflow-x-auto gap-2 rounded min-h-[9rem] max-h-[9rem] bg-gray-300 p-[6px] py-0">
                {prevAttachments != null &&
                  prevAttachments.map((file, index) => (
                    <div
                      className="min-w-[7.8rem] max-w-[7.8rem] h-[6.8rem] flex justify-center items-center bg-white relative rounded mt-1"
                      key={file.id}
                    >
                      <div
                        className="z-10 absolute top-0 right-0 w-[1.6rem] h-[1.6rem] bg-gray-500 hover:bg-gray-600 rounded-full text-white flex justify-center items-center cursor-pointer text-sm"
                        onClick={() => {
                          setPrevAttachments((prevFiles) =>
                            prevFiles.filter((f) => f.id !== file.id)
                          );
                        }}
                      >
                        x
                      </div>
                      <img
                        src={`data:${file.fileType};base64,${file.data}`}
                        alt="file"
                        ref={(el) => (imageRef2.current[index] = el)}
                        onClick={() =>
                          toggleFullscreen(imageRef2.current[index])
                        }
                        className="w-[12rem] h-full min-h-full object-cover rounded bg-white mt-3 mr-1"
                      />
                    </div>
                  ))}
                {newAttachments.map((file, index) => (
                  <div
                    className="min-w-[7.8rem] max-w-[7.8rem] h-[6.8rem] flex justify-center items-center bg-white relative rounded mt-1"
                    key={index}
                  >
                    <div
                      className="z-10 absolute top-0 right-0 w-[1.6rem] h-[1.6rem] bg-gray-500 hover:bg-gray-600 rounded-full text-white flex justify-center items-center cursor-pointer text-sm"
                      onClick={() => {
                        setNewAttachments((prevFiles) =>
                          prevFiles.filter((_, i) => i !== index)
                        );
                        setPreviewFiles((prevFiles) =>
                          prevFiles.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      x
                    </div>
                    <div key={index}>
                      <img
                        src={previewFiles[index]}
                        alt={file.name}
                        ref={(element) => (imageRef.current[index] = element)}
                        onClick={() =>
                          toggleFullscreen(imageRef.current[index])
                        }
                        className="w-[12rem] h-full min-h-full object-cover rounded bg-white mt-3 mr-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <input
              type="file"
              name="postAttachments"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
            />
            <div
              onClick={() => fileInputRef.current.click()}
              className={`ml-auto flex font-sans text-gray-700 px-3 py-2 rounded-full shadow-md shadow-gray-400 bg-slate-200 hover:bg-slate-300 cursor-pointer items-center w-[10rem] mt-2`}
            >
              <IoMdAddCircle className="text-lg mr-2" />
              <p className="font-bold truncate text-sm">Add Images</p>
            </div>
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
                label="Content"
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

export default AddArticleDialog;
