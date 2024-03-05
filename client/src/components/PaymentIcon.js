import React from "react";

const ReceiptIconWithTooltip = ({ width, height, fontSize, color }) => {
  return (
    <span
      title="I'll pay!"
      style={{
        width: width,
        height: height,
        display: "inline-block",
        position: "relative",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={fontSize}
        height={fontSize}
        style={{ color: color, position: "absolute", top: 0, left: 0 }}
      >
        <path
          fill="currentColor"
          d="M4 2.5H20a1 1 0 0 1 1 1v17a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-17a1 1 0 0 1 1-1zm15 2H5v16h14zm-2 4H7a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2zm0 4H7a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2zm0 4H7a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2z"
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="12"
          fill="#fff"
          fontFamily="Arial"
          fontWeight="bold"
        >
          $
        </text>
      </svg>
    </span>
  );
};

export default ReceiptIconWithTooltip;
