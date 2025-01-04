import { useState } from "react";

function HueTile() {

    function colorsAreTooSimilar(color1, color2, threshold = 40) {
        function hexToRgb(hex) {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return { r, g, b };
        }
    
        const color1Rgb = hexToRgb(color1);
        const color2Rgb = hexToRgb(color2);
    
        // Use Euclidean distance for color similarity
        const diff = Math.sqrt(
            Math.pow(color1Rgb.r - color2Rgb.r, 2) +
            Math.pow(color1Rgb.g - color2Rgb.g, 2) +
            Math.pow(color1Rgb.b - color2Rgb.b, 2)
        );
        return diff < 40;
    }

    // Generate a random HEX color
    function generateRandomHexColor() {
        const randomColor = () => Math.floor(Math.random() * 255);
        const toHex = (x) => x.toString(16).padStart(2, '0');
        return `#${toHex(randomColor())}${toHex(randomColor())}${toHex(randomColor())}`;
    }

    // Convert HEX to HSL
    function hexToHsl(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h *= 60;
        }
        return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
    }

    // Convert HSL to HEX
    function hslToHex(h, s, l) {
        s /= 100;
        l /= 100;

        const k = (n) => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

        const r = Math.round(f(0) * 255);
        const g = Math.round(f(8) * 255);
        const b = Math.round(f(4) * 255);

        const toHex = (x) => x.toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    // Generates an analogous HEX color from a given base color
    function generateAnalogousHexColor(baseHex) {
    
        // Shift the hue for analogous colors and randomize saturation and lightness
        const [h, s, l] = hexToHsl(baseHex);
        const analogousH = (h + Math.random() * 200 - 100) % 360;
        const analogousS = Math.min(95, Math.max(0, s + Math.floor(Math.random() * 40 - 20)));
        const analogousL = Math.min(95, Math.max(0, l + Math.floor(Math.random() * 40 - 20)));

        const analogousHSL = hslToHex(analogousH, analogousS, analogousL)
        if (colorsAreTooSimilar(baseHex, analogousHSL)) {
            return generateAnalogousHexColor(baseHex);
        }
        return analogousHSL;
    }

    // Generate a complementary HEX color from a given base color
    function generateComplementaryHexColor(baseColor){
        const [h, s, l] = hexToHsl(baseColor);
        const complementaryH = (h + 180 - (Math.random() * 60) -30) % 360;
        const complementaryS = Math.floor(Math.random() * 70 + ((Math.random() < 0.5) ? Math.random() * 30 : 30));
        const complementaryL = Math.floor(Math.random() * 70 + ((Math.random() < 0.5) ? Math.random() * 30 : 30));

        const complementary = hslToHex(complementaryH, complementaryS, complementaryL)
        if(colorsAreTooSimilar(baseColor, complementary)){
            return generateComplementaryHexColor(baseColor);
        }
        return complementary;
    }

    function generateMonochromaticHexColor(baseColor){
        const [h, s, l] = hexToHsl(baseColor);
        const monochromaticH = h;
        const monochromaticS = s;
        const monochromaticL = Math.random() < 0.5 ?
                                                Math.min(100, l + Math.floor(15 + Math.random() * 15)) :
                                                Math.max(0,l - Math.floor(15 + Math.random() * 15));
        const monochromaticColor = hslToHex(monochromaticH, monochromaticS, monochromaticL);
        if(colorsAreTooSimilar(baseColor, monochromaticColor)){
            return generateMonochromaticHexColor(baseColor);
        }
        return monochromaticColor;
    }

    function generatePairingColor(baseColor) {
        const colorFunctions = [
            generateAnalogousHexColor,
            generateAnalogousHexColor, //intentionally repeated to increase likelihood of analogous colors
            generateComplementaryHexColor,
            generateComplementaryHexColor, //intentionally repeated to increase likelihood of complementary colors
            generateMonochromaticHexColor
        ]
        const randomFunction = colorFunctions[Math.floor(Math.random() * colorFunctions.length)];
        return randomFunction(baseColor);
    }

    function getTitleColor(color){
        const hsl = hexToHsl(color);
        if (hsl[2] > 50){ // color is light
            return hslToHex(hsl[0], hsl[1], Math.max(hsl[2] - 60, 0));
        }
        return hslToHex(hsl[0], hsl[1], Math.min(hsl[2] + 60, 100));
    }
    
    
    const [outerColor, setOuterColor] = useState(generateRandomHexColor());
    const [innerColor, setInnerColor] = useState(generatePairingColor(outerColor));
    const [outerTitleText, setOuterTitleText] = useState(outerColor);
    const [innerTitleText, setInnerTitleText] = useState(innerColor);
    

    const outerTitleColor = () => {
        if(isOuterHovered && isInnerHovered){
            return 'transparent';
        }
        return getTitleColor(outerColor);
    }
    const innerTitleColor = getTitleColor(innerColor);

    // Clipboard copy function
    const copyToClipboard = (color, isInner) => {
        // check if isInner is false and the inner color is being hovered and cancels if so
        if (!isInner && document.querySelector('.inner-color:hover')) {
            return;
        }
        else{
            if (isInner) {
                setInnerTitleText("Copied!");
                setTimeout(() => {setInnerTitleText(innerColor);}, 2000);
            }
            else {
                setOuterTitleText("Copied!");
                setTimeout(() => {setOuterTitleText(outerColor);}, 2000);
            }
            navigator.clipboard.writeText(color);
        }
    };

    const [isInnerHovered, setIsInnerHovered] = useState(false);
    const [isOuterHovered, setIsOuterHovered] = useState(false);

    const handleInnerHover = (hovering) => {
        setIsInnerHovered(hovering);

    };

    const handleOuterHover = (hovering) => {
        setIsOuterHovered(hovering);
    };


    return (
        <div
        className="outer-color"
        style={{ backgroundColor: outerColor, '--outerTitleColor': outerTitleColor() }}
        onClick={() => copyToClipboard(outerColor, false)}
        onMouseEnter={() => handleOuterHover(true)}
        onMouseLeave={() => handleOuterHover(false)}
        >
        <h1 className="outer-title">{outerTitleText}</h1>
        <div
            className="inner-color"
            style={{ backgroundColor: innerColor,
                     '--innerTitleColor': innerTitleColor}}
            onClick={() => copyToClipboard(innerColor, true)}
            onMouseEnter={() => handleInnerHover(true)}
            onMouseLeave={() => handleInnerHover(false)}
        >
            <h1 className="inner-title">{innerTitleText}</h1>
        </div>
        </div>
    );
}

export default HueTile;