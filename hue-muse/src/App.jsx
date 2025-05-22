import React, { useState, useEffect } from "react";
import MuseHeader from "./components/MuseHeader.jsx";
import HueTile from "./components/HueTile.jsx";
import UpButton from "./components/UpButton.jsx";
import DarkButton from "./components/DarkButton.jsx";
import BaseColorInput from "./components/BaseColorInput.jsx";

function App() {
  const [tiles, setTiles] = useState(Array.from({ length: 30 }));
  const [baseColor, setBaseColor] = useState(null);

  const loadMoreTiles = () => {
    setTiles((prevTiles) => [
      ...prevTiles,
      ...Array.from({ length: 30 }),
    ]);
  };

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 300) {
      loadMoreTiles();
    }
  };

  const handleBaseColorChange = (color) => {
    setBaseColor(color);
    // Reset tiles when base color changes
    setTiles(Array.from({ length: 30 }));
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
      <BaseColorInput onColorChange={handleBaseColorChange} />
      <div className="color-container">
        {tiles.map((_, index) => (
          <HueTile key={index} baseColor={baseColor} />
        ))}
      </div>
      <UpButton />
      <DarkButton/>
    </>
  );
}

export default App;