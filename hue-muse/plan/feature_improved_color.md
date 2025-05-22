# Improved Color Pair Generation

## Overview

Enhance the color pair generation algorithm to create more diverse, harmonious, and visually appealing color combinations. The focus is on generating pairs of colors that work well together while maintaining visual interest and accessibility.

## Color Theory Implementation

### 1. Color Pair Types

1. **True Complementary**

   - Colors exactly opposite on the color wheel (180°)
   - Creates maximum contrast and visual impact
   - Add slight variations in saturation/lightness for softer pairs

2. **Split Complementary**

   - Base color + one color 150° away
   - Creates strong contrast while being less intense than true complementary
   - Good for creating dynamic but balanced pairs

3. **Analogous**

   - Colors within 30-60° of each other
   - Creates harmonious, cohesive pairs
   - Vary saturation and lightness for visual interest

4. **Monochromatic**
   - Same hue with different saturation/lightness
   - Creates sophisticated, elegant pairs
   - Ensure sufficient contrast between the two shades

### 2. Color Quality Parameters

1. **Contrast Management**

   - Minimum contrast ratio of 3:1 for readability
   - Maximum contrast ratio of 21:1 to avoid eye strain
   - Balance between contrast and harmony

2. **Saturation Control**

   - At least one color should have high saturation (70-100%)
   - Second color can be more muted (30-70%)
   - Avoid both colors being too saturated or too muted

3. **Lightness Distribution**
   - One color should be lighter (60-90% lightness)
   - One color should be darker (10-40% lightness)
   - Creates clear visual hierarchy

### 3. Implementation Details

```javascript
// Pseudo-code for improved color pair generation
function generateColorPair(baseColor) {
  const [h, s, l] = hexToHsl(baseColor);

  // Define pair types with their parameters
  const pairTypes = {
    complementary: {
      hueOffset: 180,
      saturationRange: [70, 100],
      lightnessRange: [20, 80],
    },
    splitComplementary: {
      hueOffset: 150,
      saturationRange: [60, 90],
      lightnessRange: [30, 70],
    },
    analogous: {
      hueOffset: 45,
      saturationRange: [50, 100],
      lightnessRange: [40, 60],
    },
    monochromatic: {
      hueOffset: 0,
      saturationRange: [30, 100],
      lightnessRange: [20, 80],
    },
  };

  // Select pair type based on base color properties
  const pairType = selectPairType(h, s, l);
  const params = pairTypes[pairType];

  // Generate second color
  const secondColor = generateSecondColor(h, s, l, params);

  // Verify and adjust if needed
  return verifyAndAdjustPair(baseColor, secondColor);
}
```

### 4. Color Selection Logic

1. **Base Color Analysis**

   - Analyze hue, saturation, and lightness of base color
   - Determine which pair type would work best
   - Consider color temperature (warm/cool)

2. **Pair Type Selection**

   - For very saturated colors: use complementary or split complementary
   - For muted colors: use analogous or monochromatic
   - For very light/dark colors: use contrasting lightness values

3. **Quality Checks**
   - Verify contrast ratio meets accessibility standards
   - Ensure colors are sufficiently different
   - Check for color blindness compatibility

## Success Criteria

1. **Diversity**

   - Each refresh should produce noticeably different pairs
   - All pair types should be represented over multiple generations
   - Colors should feel fresh and interesting

2. **Quality**

   - Pairs should be visually pleasing
   - Colors should work well together
   - Maintain good contrast for readability

3. **Performance**
   - Color generation should be fast
   - No noticeable delay in UI updates
   - Smooth transitions between pairs

## Implementation Steps

1. **Phase 1: Core Color Generation**

   - [ ] Implement new color pair generation functions
   - [ ] Add color quality checks
   - [ ] Test with various base colors

2. **Phase 2: Refinement**

   - [ ] Add color temperature consideration
   - [ ] Implement contrast ratio checks
   - [ ] Add color blindness compatibility

3. **Phase 3: Testing & Optimization**
   - [ ] Test with edge cases
   - [ ] Optimize performance
   - [ ] Gather user feedback
