import React, { createContext, useEffect, useState, useRef } from "react";

export const RectContext = createContext();

export const RectProvider = ({ children }) => {
  const refs = {
    locationInput: useRef(null),
    searchButton: useRef(null),
    destinationList: useRef(null),
    description: useRef(null),
    cityInfo: useRef(null)
    // ... add more here
  };

  const [rects, setRects] = useState({});

  useEffect(() => {
    const updateRects = () => {
      const newRects = {};
      for (const [key, ref] of Object.entries(refs)) {
        if (ref.current) {
          newRects[key] = ref.current.getBoundingClientRect();
        }
      }
      setRects(newRects);
    };

    window.requestAnimationFrame(() => {
      updateRects();
    });
    
    window.addEventListener("resize", updateRects);
    return () => {
      window.removeEventListener("resize", updateRects);
    };
  }, []);

  return (
    <RectContext.Provider value={{ refs, rects }}>
      {children}
    </RectContext.Provider>
  );
};