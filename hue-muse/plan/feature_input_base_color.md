# Base Color Input Feature Specification

## Overview

Add a base color input feature that allows users to specify a primary color, which will then be used to generate compatible color combinations. This will help users find relevant color schemes more efficiently when they have a specific color in mind.

## User Story

As a user, I want to input a specific base color so that I can see only color combinations that include my chosen color, making it easier to find relevant color schemes for my design needs.

## Technical Requirements

### 1. UI Components

- Create a compact, static input section at the top of the main interface (above color tiles)
- Include a color picker input on the left side
- Add a text input field for hex codes on the right side
- Add a small refresh icon button for resetting
- Implement a tooltip that explains the feature on hover
- Use a subtle, non-distracting background that matches the app's theme
- Show placeholder text in the hex input when no color is selected

### 2. UI Design Details

- Color picker and hex input should be in a single row
- Input container should have a subtle background (no gradient)
- Refresh icon should be small and unobtrusive
- Tooltip should appear on hover over the entire input section
- Placeholder text should say "Enter hex code or use color picker"
- All elements should maintain consistent spacing and alignment

### 3. State Management

- Create a new state variable to store the selected base color
- Implement color validation for the hex input
- Add persistence of the selected color (optional: localStorage)
- Handle invalid hex code inputs gracefully

### 4. Color Generation Logic

- Modify the existing color generation algorithm to:
  - Use the selected base color as the primary color
  - Generate complementary colors based on the base color
  - Ensure all generated combinations include the base color
  - Maintain color harmony rules with the base color

### 5. Implementation Steps

1. **UI Implementation**

   - [ ] Create a new component `BaseColorInput`
   - [ ] Implement the single-row layout with color picker and hex input
   - [ ] Add the refresh icon button
   - [ ] Implement the tooltip system
   - [ ] Style the component to match existing UI

2. **State Management**

   - [ ] Add base color state to the main app
   - [ ] Implement color validation
   - [ ] Add state update handlers
   - [ ] Implement reset functionality

3. **Color Generation Updates**

   - [ ] Modify color generation algorithm
   - [ ] Add base color constraints
   - [ ] Update color combination logic
   - [ ] Implement fallback for invalid colors

4. **Testing & Validation**
   - [ ] Test color input validation
   - [ ] Verify color generation with different base colors
   - [ ] Test UI responsiveness
   - [ ] Validate color harmony rules

## Success Criteria

- Users can input colors via hex code or color picker
- The UI is compact and intuitive
- Generated combinations always include the base color
- Color combinations maintain harmony rules
- Invalid color inputs are handled gracefully
- Tooltip provides clear feature explanation
- Reset functionality is easily accessible but unobtrusive

## UI Mockup

```
+------------------------------------------+
|  [Color Picker] [Hex Input        ] [↻]  |
+------------------------------------------+
```
