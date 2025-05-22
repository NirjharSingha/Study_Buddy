"use client";

import React, { useRef } from "react";
import { useState } from "react";
import Loading from "@/components/Loading";
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
    const getBookmarks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${
            process.env.NEXT_PUBLIC_SERVER_URL
          }/resources/getBookmarks?userId=${jwtDecode(token).sub}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          console.log(response);
          setShowLoading(false);
          const articles = response.data.filter(
            (res) => res.type === "Article"
          );
          const videos = response.data.filter((res) => res.type === "Video");
          setArticles(articles);
          setVideos(videos);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getBookmarks();
  }, [reloadFlag]);

  return (
    <div
      className="w-full overflow-y-auto scrollbar-hide"
      style={{ height: "calc(100svh - 69.6px)", overflowY: "auto" }}
    >
      <div className={`px-4 py-5 max-w-[1050px] mx-auto`}>
        {articles.length > 0 && (
          <h1 className="text-3xl font-bold text-center text-gray-800 mt-2 mb-4">
            Bookmarked Articles
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
            Bookmarked Videos
          </h1>
        )}

        {videos.length === 0 ? (
          <p className="text-center text-gray-500"></p>
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
          No bookmarks to show.
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
