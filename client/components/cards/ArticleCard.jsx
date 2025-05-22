"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import AddArticleDialog from "../dialogs/AddArticleDialog";
import ArticleDialog from "../dialogs/ArticleDialog";
import { FaRegBookmark } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa6";
import axios from "axios";
import { useGlobals } from "@/contexts/Globals";
import { jwtDecode } from "jwt-decode";

const articleCard = ({ article, setReloadFlag }) => {
  const pathname = usePathname();
  const dialogRef = useRef(null);
  const buttonRef = useRef(null);
  const { setToastMessage } = useGlobals();

  const toogleBookmark = async () => {
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
        if (!article.isBookmarked) {
          setToastMessage("Article bookmarked successfully");
        } else {
          setToastMessage("Article unbookmarked successfully");
        }
        setReloadFlag((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="card w-full lg:card-side bg-base-100 shadow-md border-[0.5px] border-t-[0.7px] border-gray-200 card-hover h-[18.7rem] mb-5">
      <img
        src={
          article.files.length > 0
            ? `data:image/jpeg;base64,${article.files[0].data}`
            : "/article.png"
        }
        alt="Album"
        className="w-[23rem] h-full object-cover rounded-l-xl"
      />
      <div className="card-body bg-slate-100">
        <h2
          className="card-title text-[1.2rem]"
          style={{ lineHeight: "1.4rem" }}
        >
          {article.title}
        </h2>
        <div className="text-[1rem]">
          <span className="font-semibold">Tag : </span>
          {article.tag}
        </div>
        <div className="text-[1rem]">
          <span className="font-semibold">Author : </span>
          {article.author}
        </div>
        <div className="text-[1rem]">
          <span className="font-semibold">Class : </span>
          {article.classNumber}
        </div>
        <p className="text-[1rem] line-clamp-3">
          <span className="font-semibold">Description : </span>
          {article.content}
        </p>
        <div className="flex justify-between items-center">
          <div className="card-actions justify-end gap-12">
            <Button
              className="font-bold"
              onClick={() => {
                buttonRef.current.click();
              }}
            >
              Details
            </Button>
          </div>
          {pathname.includes("/account/uploads") && (
            <div className="card-actions justify-end gap-12">
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
          {!pathname.includes("/account/uploads") && !article.isBookmarked && (
            <div className="card-actions justify-end gap-12 hover:bg-slate-200 rounded-full p-2">
              <FaRegBookmark
                className="text-2xl cursor-pointer"
                onClick={toogleBookmark}
              />
            </div>
          )}
          {!pathname.includes("/account/uploads") && article.isBookmarked && (
            <div className="card-actions justify-end gap-12 hover:bg-slate-200 rounded-full p-2">
              <FaBookmark
                className="text-2xl cursor-pointer"
                onClick={toogleBookmark}
              />
            </div>
          )}
        </div>
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

export default articleCard;
