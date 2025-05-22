"use client";

import React from "react";
import { useState } from "react";
import Loading from "@/components/Loading";
import axios from "axios";
import { useEffect } from "react";
import ArticleCard from "@/components/cards/ArticleCard2";
import VideoCard from "@/components/cards/VideoCard2";
import { useParams } from "next/navigation";

const allClasses = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const Page = () => {
  const params = useParams();
  const tag = params.tag;
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [fetchedArticles, setFetchedArticles] = useState([]);
  const [fetchedVideos, setFetchedVideos] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const [reloadFlag, setReloadFlag] = useState(true);
  const [selectedClass, setSelectedClass] = useState(0);

  useEffect(() => {
    const getAll = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/resources/getAll`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          console.log(response.data);
          setShowLoading(false);

          // Filter by tag
          const filtered = response.data.filter(
            (res) => tag === "All" || res.tag === tag
          );

          // Divide into articles and videos
          const articles = filtered.filter((res) => res.type === "Article");
          const videos = filtered.filter((res) => res.type === "Video");

          setArticles(articles);
          setVideos(videos);
          setFetchedArticles(articles);
          setFetchedVideos(videos);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getAll();
  }, [reloadFlag, tag]); // Include `tag` in the dependency array

  useEffect(() => {
    const filterArticles = () => {
      let filteredArticles = fetchedArticles;
      if (selectedClass !== 0) {
        filteredArticles = filteredArticles.filter(
          (res) => res.classNumber == selectedClass
        );
      }
      setArticles(filteredArticles);
    };

    const filterVideos = () => {
      let filteredVideos = fetchedVideos;
      if (selectedClass !== 0) {
        filteredVideos = filteredVideos.filter(
          (res) => res.classNumber == selectedClass
        );
      }
      setVideos(filteredVideos);
    };

    filterArticles();
    filterVideos();
  }, [fetchedArticles, fetchedVideos, selectedClass]);

  return (
    <div
      className="w-full overflow-y-auto scrollbar-hide"
      style={{ height: "calc(100svh - 69.6px)", overflowY: "auto" }}
    >
      <div
        className={`w-full bg-gray-700 p-4 shadow-md shadow-gray-400 rounded-bl-xl`}
      >
        <div className="flex w-full items-center justify-between px-6 flex-wrap gap-4">
          <p className="text-white text-xl font-bold">{`Resources for ${tag}`}</p>

          <div className="flex gap-4">
            {/* Class Select */}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(Number(e.target.value))}
              className="px-3 py-1 rounded-md border border-gray-300 bg-white text-black"
            >
              {allClasses.map((cls) => (
                <option key={cls} value={cls}>
                  Class {cls}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className={`px-4 py-5 max-w-[1050px] mx-auto`}>
        {articles.length > 0 && (
          <h1 className="text-3xl font-bold text-center text-gray-800 mt-2 mb-4">
            Articles
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
            Videos
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
        {videos.length === 0 && articles.length === 0 && (
          <p className="text-center text-gray-500 mt-30">No resource to show</p>
        )}
      </div>
      {showLoading && (
        <div className="col-span-4">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default Page;
