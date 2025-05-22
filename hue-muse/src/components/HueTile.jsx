import { useState, useEffect } from "react";

function HueTile({ baseColor }) {

    // Color generation configuration
    const COLOR_CONFIG = {
        similarity: {
            threshold: 60,        // Threshold for considering colors too similar
            minSaturation: 20,    // Minimum saturation percentage
            maxSaturation: 100,   // Maximum saturation percentage
            minLightness: 5,      // Minimum lightness percentage
            maxLightness: 95      // Maximum lightness percentage
        },
        monochromatic: {
            saturationVariation: 40,  // Base variation in saturation
            saturationRandom: 20,     // Additional random variation in saturation
            lightnessVariation: 50,   // Base variation in lightness
            lightnessRandom: 20       // Additional random variation in lightness
        },
        analogous: {
            hueVariation: 100,    // Maximum hue variation in degrees
            saturationVariation: 40,  // Variation in saturation
            lightnessVariation: 40    // Variation in lightness
        },
        complementary: {
            hueOffset: 180,       // Base complementary offset
            hueVariation: 60,     // Maximum variation from perfect complementary
            minSaturation: 30,    // Minimum saturation for complementary colors
            maxSaturation: 100,   // Maximum saturation for complementary colors
            lightnessVariation: 70 // Variation in lightness
        }
    };

    function colorsAreTooSimilar(color1, color2, threshold = COLOR_CONFIG.similarity.threshold) {
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
        return diff < threshold;
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
            h = Math.random() * 360; // Random hue for neutral colors
            s = 0; // No saturation for neutral colors
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

    // Helper function to generate balanced lightness
    function generateBalancedLightness(baseLightness, variation, randomVariation) {
        // Generate a random lightness value within the allowed range
        const randomLightness = Math.random() * 
            (COLOR_CONFIG.similarity.maxLightness - COLOR_CONFIG.similarity.minLightness) + 
            COLOR_CONFIG.similarity.minLightness;
        
        // Blend the random lightness with the base lightness
        const blendFactor = 0.3; // How much to consider the base lightness
        return Math.round(
            (randomLightness * (1 - blendFactor)) + 
            (baseLightness * blendFactor)
        );
    }

    function generateMonochromaticHexColor(baseColor){
        const [h, s, l] = hexToHsl(baseColor);
        const monochromaticH = s === 0 ? Math.random() * 360 : h; // Random hue if neutral
        
        // More variation in saturation
        const saturationChange = Math.random() < 0.5 ? 
            Math.min(COLOR_CONFIG.similarity.maxSaturation, 
                    s + COLOR_CONFIG.monochromatic.saturationVariation + 
                    Math.random() * COLOR_CONFIG.monochromatic.saturationRandom) : 
            Math.max(COLOR_CONFIG.similarity.minSaturation, 
                    s - COLOR_CONFIG.monochromatic.saturationVariation - 
                    Math.random() * COLOR_CONFIG.monochromatic.saturationRandom);
        
        // Generate balanced lightness
        const lightnessChange = generateBalancedLightness(
            l,
            COLOR_CONFIG.monochromatic.lightnessVariation,
            COLOR_CONFIG.monochromatic.lightnessRandom
        );

        const monochromaticColor = hslToHex(monochromaticH, saturationChange, lightnessChange);
        
        if(colorsAreTooSimilar(baseColor, monochromaticColor)){
            return generateMonochromaticHexColor(baseColor);
        }
        return monochromaticColor;
    }

    function generateAnalogousHexColor(baseHex) {
        const [h, s, l] = hexToHsl(baseHex);
        const baseHue = s === 0 ? Math.random() * 360 : h; // Random hue if neutral
        const analogousH = (baseHue + Math.random() * COLOR_CONFIG.analogous.hueVariation - 
                          COLOR_CONFIG.analogous.hueVariation/2) % 360;
        const analogousS = Math.min(COLOR_CONFIG.similarity.maxSaturation, 
                                  Math.max(COLOR_CONFIG.similarity.minSaturation, 
                                          s + Math.floor(Math.random() * COLOR_CONFIG.analogous.saturationVariation - 
                                                        COLOR_CONFIG.analogous.saturationVariation/2)));
        
        // Generate balanced lightness
        const analogousL = generateBalancedLightness(
            l,
            COLOR_CONFIG.analogous.lightnessVariation,
            COLOR_CONFIG.analogous.lightnessVariation
        );

        const analogousHSL = hslToHex(analogousH, analogousS, analogousL);
        if (colorsAreTooSimilar(baseHex, analogousHSL)) {
            return generateAnalogousHexColor(baseHex);
        }
        return analogousHSL;
    }

    function generateComplementaryHexColor(baseColor){
        const [h, s, l] = hexToHsl(baseColor);
        const baseHue = s === 0 ? Math.random() * 360 : h; // Random hue if neutral
        const complementaryH = (baseHue + COLOR_CONFIG.complementary.hueOffset - 
                              (Math.random() * COLOR_CONFIG.complementary.hueVariation) - 
                              COLOR_CONFIG.complementary.hueVariation/2) % 360;
        const complementaryS = Math.floor(Math.random() * 
            (COLOR_CONFIG.complementary.maxSaturation - COLOR_CONFIG.complementary.minSaturation) + 
            COLOR_CONFIG.complementary.minSaturation);
        
        // Generate balanced lightness
        const complementaryL = generateBalancedLightness(
            l,
            COLOR_CONFIG.complementary.lightnessVariation,
            COLOR_CONFIG.complementary.lightnessVariation
        );

        const complementary = hslToHex(complementaryH, complementaryS, complementaryL);
        if(colorsAreTooSimilar(baseColor, complementary)){
            return generateComplementaryHexColor(baseColor);
        }
        return complementary;
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

    useEffect(() => {
        if (baseColor) {
            setOuterColor(baseColor);
            setInnerColor(generatePairingColor(baseColor));
            setOuterTitleText(baseColor);
            setInnerTitleText(generatePairingColor(baseColor));
        } else {
            const newOuterColor = generateRandomHexColor();
            setOuterColor(newOuterColor);
            setInnerColor(generatePairingColor(newOuterColor));
            setOuterTitleText(newOuterColor);
            setInnerTitleText(generatePairingColor(newOuterColor));
        }
    }, [baseColor]);

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