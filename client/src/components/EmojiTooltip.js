import React from "react";
import { Tooltip } from "@mui/material";

// Function to check if an emoji is supported
const isEmojiSupported = (emoji) => {
  // Create a temporary element to test emoji rendering
  const testElement = document.createElement("div");
  testElement.style.fontSize = "50px";
  testElement.style.visibility = "hidden";
  testElement.innerHTML = emoji;
  document.body.appendChild(testElement);
  const isSupported = testElement.offsetWidth > 0;
  document.body.removeChild(testElement);
  return isSupported;
};

const EmojiTooltip = () => {
  const pleadingFaceEmoji = "🥹";
  const fallbackEmoji = "😊"; // Fallback emoji
  const [supportedEmoji, setSupportedEmoji] = React.useState(fallbackEmoji);

  React.useEffect(() => {
    // Check if the emoji is supported
    const isSupported = isEmojiSupported(pleadingFaceEmoji);
    setSupportedEmoji(isSupported ? pleadingFaceEmoji : fallbackEmoji);
  }, []);

  return (
    <Tooltip title="Please pay">
      <span
        role="img"
        aria-label="pleading face"
        style={{
          fontSize: "20px",
          fontFamily:
            "'Segoe UI Emoji', 'Apple Color Emoji', 'Segoe UI', 'Roboto', sans-serif",
        }}
      >
        {supportedEmoji}
      </span>
    </Tooltip>
  );
};

export default EmojiTooltip;
