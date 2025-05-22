import React from "react";
import Lottie from "lottie-react";
import loading from "@/animations/loading.json";

const Loading = () => {
  return (
    <Lottie
      animationData={loading}
      className="w-[2rem] h-[2rem] sm:w-[2.5rem] sm:h-[2.5rem] m-auto"
    />
  );
};

export default Loading;

// responsive
