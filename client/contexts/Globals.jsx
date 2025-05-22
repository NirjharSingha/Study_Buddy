"use client";

import React, { createContext, useContext, useState, useRef } from "react";

const GlobalsContext = createContext();

export function useGlobals() {
  return useContext(GlobalsContext);
}

const GlobalsProvider = ({ children }) => {
  const toastRef = useRef(null);
  const [toastMessage, setToastMessage] = useState("");

  return (
    <GlobalsContext.Provider
      value={{
        toastRef,
        toastMessage,
        setToastMessage,
      }}
    >
      {children}
    </GlobalsContext.Provider>
  );
};

export default GlobalsProvider;
