import React from "react";
import { Tooltip } from "@mui/material";

const isEmojiSupported = (emoji) => {
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
  const fallbackText = "Please pay";
  const [emojiOrText, setEmojiOrText] = React.useState(pleadingFaceEmoji);

  React.useEffect(() => {
    const supported = isEmojiSupported(pleadingFaceEmoji);
    setEmojiOrText(supported ? pleadingFaceEmoji : fallbackText);
  }, []);

  return (
    <Tooltip title="Please pay">
      <span
        role="img"
        aria-label="pleading face"
        style={{
          display: "inline-block",
          fontSize: "24px",
          lineHeight: "1",
          width: "24px",
          height: "24px",
          textAlign: "center",
          verticalAlign: "middle",
          fontFamily:
            "'Segoe UI Emoji', 'Apple Color Emoji', 'Segoe UI', 'Roboto', sans-serif",
          whiteSpace: "nowrap",
        }}
      >
        {emojiOrText}
      </span>
    </Tooltip>
  );
};

export default EmojiTooltip;
