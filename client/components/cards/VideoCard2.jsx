"use client";

import React, { useRef } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import AddVideoDialog from "../dialogs/AddVideoDialog";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import axios from "axios";
import { useGlobals } from "@/contexts/Globals";
import { jwtDecode } from "jwt-decode";

const VideoCard = ({ video, setReloadFlag }) => {
  const pathname = usePathname();
  const dialogRef = useRef(null);
  const { setToastMessage } = useGlobals();

  const toggleBookmark = async () => {
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
        setToastMessage(
          video.isBookmarked
            ? "Video unbookmarked successfully"
            : "Video bookmarked successfully"
        );
        setReloadFlag((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative flex flex-col w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 mb-6 max-h-[32rem]">
      {/* Video Section */}
      <div className="relative w-full h-48">
        {video.files && video.files.length > 0 ? (
          <video
            src={`data:video/mp4;base64,${video.files[0].data}`}
            controls
            className="w-full h-full object-cover rounded-t-2xl transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-t-2xl">
            <span className="text-gray-500">No Video Available</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-5 bg-gradient-to-br from-gray-50 to-white">
        <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 hover:text-indigo-600 transition-colors duration-200">
          {video.title}
        </h2>
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-sm font-semibold text-gray-600">Tag:</span>
          <span className="text-sm text-indigo-500 bg-indigo-100 px-2 py-1 rounded-full">
            {video.tag}
          </span>
        </div>
        <div className="text-sm text-gray-600 mb-3">
          <span className="font-semibold">Owner:</span> {video.author}
        </div>
        <div className="text-sm text-gray-600 mb-3">
          <span className="font-semibold">Class:</span> {video.classNumber}
        </div>
        <p className="text-gray-700 text-sm line-clamp-2 mb-4">
          {video.content}
        </p>

        {/* Spacer to push actions to bottom */}
        <div className="flex-1"></div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          {pathname.includes("/account/uploads") ? (
            <Button
              className="bg-gray-600 text-white hover:bg-gray-700 transition-colors duration-200 font-semibold px-4 py-2 rounded-lg"
              onClick={() => dialogRef.current.click()}
            >
              Edit
            </Button>
          ) : (
            <div className="flex-1"></div>
          )}
          {!pathname.includes("/account/uploads") && (
            <div
              className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
              onClick={toggleBookmark}
            >
              {video.isBookmarked ? (
                <FaBookmark className="text-2xl text-indigo-600" />
              ) : (
                <FaRegBookmark className="text-2xl text-gray-600 hover:text-indigo-600 transition-colors duration-200" />
              )}
            </div>
          )}
        </div>

        {/* Dialog */}
        <AddVideoDialog
          dialogRef={dialogRef}
          isEdit={true}
          video={video}
          setReloadFlag={setReloadFlag}
        />
      </div>
    </div>
  );
};

export default VideoCard;
