import React, { useState, useEffect } from "react";
import MuseHeader from "./MuseHeader.jsx";
import HueTile from "./HueTile.jsx";
import UpButton from "./UpButton.jsx";

function App() {
  const [tiles, setTiles] = useState(Array.from({ length: 30 })); // Start with a smaller number of tiles

  const loadMoreTiles = () => {
    setTiles((prevTiles) => [
      ...prevTiles,
      ...Array.from({ length: 30 }), // Add 30 more tiles
    ]);
  };

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    // Check if the user has scrolled to the bottom of the webpage
    if (scrollTop + clientHeight >= scrollHeight - 300) {
      loadMoreTiles();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <MuseHeader />
      <div className="color-container">
        {tiles.map((_, index) => (
          <HueTile key={index} />
        ))}
      </div>
      <UpButton />
    </>
  );
}

export default App;