import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";

const TypingText = ({
  text,
  speed = 50,
  delay = 0,
  variant = "h1",
  color = "inherit",
  sx = {},
  highlights = [],
  cursorOptions = {},
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Default cursor options
  const {
    color: cursorColor = "currentColor",
    width = "2px",
    height = "1em",
    blinkSpeed = "1s",
    style: cursorStyle = {},
  } = cursorOptions;

  useEffect(() => {
    // Initial delay before typing starts
    const delayTimer = setTimeout(() => {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(text.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
          setIsTypingComplete(true);
        }
      }, speed);

      return () => clearInterval(typingInterval);
    }, delay);

    return () => clearTimeout(delayTimer);
  }, [text, speed, delay]);

  // Cursor blinking effect
  useEffect(() => {
    if (isTypingComplete) {
      // Stop blinking after typing is complete
      const timer = setTimeout(() => {
        setShowCursor(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      const cursorInterval = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 500);
      return () => clearInterval(cursorInterval);
    }
  }, [isTypingComplete]);

  // Apply highlights to the displayed text
  const renderHighlightedText = () => {
    if (!highlights || highlights.length === 0) {
      return displayedText;
    }

    // Sort highlights by start index for proper application
    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);
    let lastIndex = 0;
    const elements = [];

    sortedHighlights.forEach((highlight, i) => {
      // Add text before highlight
      if (highlight.start > lastIndex) {
        elements.push(
          <span key={`before-${i}`}>
            {displayedText.substring(lastIndex, highlight.start)}
          </span>
        );
      }

      // Add highlighted text
      const highlightEnd = Math.min(highlight.end, displayedText.length);
      const highlightText = displayedText.substring(
        highlight.start,
        highlightEnd
      );

      elements.push(
        <span
          key={`highlight-${i}`}
          style={{
            color: highlight.color,
            background: highlight.background,
            fontWeight: highlight.bold ? "bold" : "inherit",
            fontStyle: highlight.italic ? "italic" : "inherit",
            textDecoration: highlight.underline ? "underline" : "none",
            ...highlight.style,
          }}
        >
          {highlightText}
        </span>
      );

      lastIndex = highlightEnd;
    });

    // Add remaining text after last highlight
    if (lastIndex < displayedText.length) {
      elements.push(
        <span key="remaining-text">{displayedText.substring(lastIndex)}</span>
      );
    }

    return elements;
  };

  return (
    <Typography
      variant={variant}
      color={color}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        minHeight: "1.2em", // Prevent layout shift
        ...sx,
      }}
    >
      {highlights.length > 0 ? renderHighlightedText() : displayedText}
      {showCursor && (
        <span
          style={{
            width,
            height,
            backgroundColor: cursorColor,
            marginLeft: "2px",
            opacity: 0.8,
            display: "inline-block",
            animation: `blink ${blinkSpeed} step-end infinite`,
            "@keyframes blink": {
              "from, to": { opacity: 0 },
              "50%": { opacity: 1 },
            },
            ...cursorStyle,
          }}
        />
      )}
    </Typography>
  );
};

export default TypingText;
