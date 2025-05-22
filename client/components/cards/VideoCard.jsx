"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import AddVideoDialog from "../dialogs/AddVideoDialog";
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";
import axios from "axios";
import { useGlobals } from "@/contexts/Globals";
import { jwtDecode } from "jwt-decode";

const VideoCard = ({ video, setReloadFlag }) => {
  const pathname = usePathname();
  const dialogRef = useRef(null);
  const { setToastMessage } = useGlobals();

  const toogleBookmark = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_SERVER_URL
        }/resources/toggleBookmark?userId=${jwtDecode(token).sub}&resourceId=${
          video.id
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        if (!video.isBookmarked) {
          setToastMessage("Video bookmarked successfully");
        } else {
          setToastMessage("Video unbookmarked successfully");
        }
        setReloadFlag((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`bg-white p-3 w-[28rem] h-[32.3rem] rounded-lg shadow-md border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg flex flex-col gap-2`}
    >
      {video.files && video.files.length > 0 && (
        <video
          src={`data:video/mp4;base64,${video.files[0].data}`}
          controls
          className="w-full h-[220px] rounded-md object-cover"
        />
      )}
      <h2 className="card-title text-[1.2rem]" style={{ lineHeight: "1.4rem" }}>
        {video.title}
      </h2>
      <div className="text-[1rem]">
        <span className="font-semibold">Tag : </span>
        {video.tag}
      </div>
      <div className="text-[1rem]">
        <span className="font-semibold">Owner : </span>
        {video.author}
      </div>
      <div className="text-[1rem]">
        <span className="font-semibold">Class : </span>
        {video.classNumber}
      </div>
      <p className="text-[1rem] line-clamp-3">
        <span className="font-semibold">Description : </span>
        {video.content}
      </p>
      {pathname.includes("/account/uploads") && (
        <div className="card-actions justify-end gap-12 mt-auto">
          <Button
            className="font-bold"
            onClick={() => {
              dialogRef.current.click();
            }}
          >
            Edit
          </Button>
        </div>
      )}
      {!pathname.includes("/account/uploads") && !video.isBookmarked && (
        <div className="card-actions justify-end gap-12 p-2">
          <FaRegBookmark
            className="text-2xl cursor-pointer"
            onClick={toogleBookmark}
          />
        </div>
      )}
      {!pathname.includes("/account/uploads") && video.isBookmarked && (
        <div className="card-actions justify-end gap-12 p-2">
          <FaBookmark
            className="text-2xl cursor-pointer"
            onClick={toogleBookmark}
          />
        </div>
      )}
      <AddVideoDialog
        dialogRef={dialogRef}
        isEdit={true}
        video={video}
        setReloadFlag={setReloadFlag}
      />
    </div>
  );
};

export default VideoCard;

// responsive
