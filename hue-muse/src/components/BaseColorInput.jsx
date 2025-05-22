import React, { useState } from 'react';

const BaseColorInput = ({ onColorChange }) => {
  const [color, setColor] = useState('');
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    onColorChange(newColor);
  };

  const handleReset = () => {
    setColor('');
    onColorChange(null);
  };

  const handleHexInput = (e) => {
    const value = e.target.value;
    // Only allow valid hex characters
    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
      setColor(value);
      if (value.length === 7) { // Complete hex code
        onColorChange(value);
      }
    }
  };

  return (
    <div 
      className="base-color-input"
      onMouseEnter={() => setTooltipVisible(true)}
      onMouseLeave={() => setTooltipVisible(false)}
    >
      <div className="base-color-container">
        <input
          type="color"
          value={color || '#000000'}
          onChange={handleColorChange}
          className="color-picker"
          title="Pick a color"
        />
        <input
          type="text"
          value={color}
          onChange={handleHexInput}
          className="color-hex"
        />
        <button 
          onClick={handleReset} 
          className="reset-button"
          title="Reset base color"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
            <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/>
          </svg>
        </button>
      </div>
      {tooltipVisible && (
        <div className="tooltip">
          Select a base color to generate color combinations that include your chosen color.
        </div>
      )}
    </div>
  );
};

export default BaseColorInput; 