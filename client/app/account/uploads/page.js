"use client";

import React, { useRef } from "react";
import { useState } from "react";
import Loading from "@/components/Loading";
import { IoMdAddCircle } from "react-icons/io";
import AddArticleDialog from "@/components/dialogs/AddArticleDialog";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useEffect } from "react";
import ArticleCard from "@/components/cards/ArticleCard";
import VideoCard from "@/components/cards/VideoCard";
import AddVideoDialog from "@/components/dialogs/AddVideoDialog";

const Page = () => {
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const dialogRef = useRef(null);
  const addVideoRef = useRef(null);
  const [reloadFlag, setReloadFlag] = useState(true);

  useEffect(() => {
    const getArticles = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/resources/getByAuthor?userId=${
            jwtDecode(token).sub
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setShowLoading(false);
          setArticles(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getVideos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${
            process.env.NEXT_PUBLIC_SERVER_URL
          }/resources/getVideosByAuthor?userId=${jwtDecode(token).sub}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setShowLoading(false);
          setVideos(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getArticles();
    getVideos();
  }, [reloadFlag]);

  return (
    <div
      className="w-full overflow-y-auto scrollbar-hide"
      style={{ height: "calc(100svh - 69.6px)", overflowY: "auto" }}
    >
      <div
        className={`w-full bg-gray-700 p-4 shadow-md shadow-gray-400 rounded-bl-xl`}
      >
        <div className="flex w-full items-center justify-between px-6">
          <p className="text-white text-xl font-bold">
            Resources You Uploaded On The Platform
          </p>
          <div
            className={`flex font-sans text-gray-700 px-3 py-2 rounded-full shadow-md shadow-gray-400 bg-slate-200 hover:bg-slate-300 cursor-pointer items-center w-[13rem]`}
            onClick={() => addVideoRef.current.click()}
          >
            <IoMdAddCircle className="text-lg mr-2" />
            <p className="font-bold truncate text-sm">Add New Video</p>
          </div>
          <div
            className={`flex font-sans text-gray-700 px-3 py-2 rounded-full shadow-md shadow-gray-400 bg-slate-200 hover:bg-slate-300 cursor-pointer items-center w-[13rem]`}
            onClick={() => dialogRef.current.click()}
          >
            <IoMdAddCircle className="text-lg mr-2" />
            <p className="font-bold truncate text-sm">Add New Article</p>
          </div>
        </div>
      </div>
      <div className={`px-4 py-5 max-w-[1050px] mx-auto`}>
        {articles.length > 0 && (
          <h1 className="text-3xl font-bold text-center text-gray-800 mt-2 mb-4">
            Your Articles
          </h1>
        )}
        {articles.length !== 0 &&
          articles.map((res) => (
            <div key={res.id} className="w-full flex justify-center">
              <ArticleCard article={res} setReloadFlag={setReloadFlag} />
            </div>
          ))}
      </div>
      <div className="px-4 py-5 max-w-[1050px] mx-auto">
        {videos.length > 0 && (
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Your Videos
          </h1>
        )}

        {videos.length === 0 ? (
          <p className="text-center text-gray-500">No videos to show.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5">
            {videos.map((res, idx) => (
              <div
                key={res.id}
                className={`flex ${
                  idx % 2 === 0 ? "justify-start" : "justify-end"
                }`}
              >
                <VideoCard video={res} setReloadFlag={setReloadFlag} />
              </div>
            ))}
          </div>
        )}
      </div>
      {showLoading && (
        <div className="col-span-4">
          <Loading />
        </div>
      )}
      {!showLoading && articles.length === 0 && videos.length === 0 && (
        <div className="w-full text-center mt-50 text-gray-500 text-lg">
          You haven't uploaded any content yet.
        </div>
      )}
      <AddArticleDialog
        dialogRef={dialogRef}
        isEdit={false}
        setReloadFlag={setReloadFlag}
      />
      <AddVideoDialog
        dialogRef={addVideoRef}
        isEdit={false}
        setReloadFlag={setReloadFlag}
      />
    </div>
  );
};

export default Page;
