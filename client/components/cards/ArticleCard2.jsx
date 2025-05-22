"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import AddArticleDialog from "../dialogs/AddArticleDialog";
import ArticleDialog from "../dialogs/ArticleDialog";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import axios from "axios";
import { useGlobals } from "@/contexts/Globals";
import { jwtDecode } from "jwt-decode";

const ArticleCard = ({ article, setReloadFlag }) => {
  const pathname = usePathname();
  const dialogRef = useRef(null);
  const buttonRef = useRef(null);
  const { setToastMessage } = useGlobals();

  const toggleBookmark = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_SERVER_URL
        }/resources/toggleBookmark?userId=${jwtDecode(token).sub}&resourceId=${
          article.id
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setToastMessage(
          article.isBookmarked
            ? "Article unbookmarked successfully"
            : "Article bookmarked successfully"
        );
        setReloadFlag((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative flex flex-col lg:flex-row w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 mb-6">
      {/* Image Section */}
      <div className="relative w-full lg:w-1/3 h-68 lg:max-h-[300px]">
        <img
          src={
            article.files.length > 0
              ? `data:image/jpeg;base64,${article.files[0].data}`
              : "/article.png"
          }
          alt={article.title}
          className="w-full h-full object-cover rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-6 bg-gradient-to-br from-gray-50 to-white">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 line-clamp-2 hover:text-indigo-600 transition-colors duration-200">
          {article.title}
        </h2>
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-sm font-semibold text-gray-600">Tag:</span>
          <span className="text-sm text-indigo-500 bg-indigo-100 px-2 py-1 rounded-full">
            {article.tag}
          </span>
        </div>
        <div className="text-sm text-gray-600 mb-3">
          <span className="font-semibold">Author:</span> {article.author}
        </div>
        <div className="text-sm text-gray-600 mb-3">
          <span className="font-semibold">Class:</span> {article.classNumber}
        </div>
        <p className="text-gray-700 text-sm line-clamp-2 mb-4">
          {article.content}
        </p>

        {/* Spacer to push actions to bottom */}
        <div className="flex-1"></div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <Button
              className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200 font-semibold px-4 py-2 rounded-lg"
              onClick={() => buttonRef.current.click()}
            >
              Details
            </Button>
            {pathname.includes("/account/uploads") && (
              <Button
                className="bg-gray-600 text-white hover:bg-gray-700 transition-colors duration-200 font-semibold px-4 py-2 rounded-lg"
                onClick={() => dialogRef.current.click()}
              >
                Edit
              </Button>
            )}
          </div>
          {!pathname.includes("/account/uploads") && (
            <div
              className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
              onClick={toggleBookmark}
            >
              {article.isBookmarked ? (
                <FaBookmark className="text-2xl text-indigo-600" />
              ) : (
                <FaRegBookmark className="text-2xl text-gray-600 hover:text-indigo-600 transition-colors duration-200" />
              )}
            </div>
          )}
        </div>

        {/* Dialogs */}
        <AddArticleDialog
          dialogRef={dialogRef}
          isEdit={true}
          article={article}
          setReloadFlag={setReloadFlag}
        />
        <ArticleDialog article={article} buttonRef={buttonRef} />
      </div>
    </div>
  );
};

export default ArticleCard;
