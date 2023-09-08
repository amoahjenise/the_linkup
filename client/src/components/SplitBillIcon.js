import React from "react";

const SplitBillIcon = ({ person1Color, person2Color, width, height }) => {
  return (
    <svg
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
    >
      {/* Tooltip */}
      <title>Let's split the bill!</title>

      {/* Person 1 */}
      <circle cx="30" cy="50" r="10" fill={person1Color}>
        <text x="26" y="54" font-size="12" font-weight="bold" fill="white">
          $
        </text>
      </circle>
      <line
        x1="30"
        y1="50"
        x2="40"
        y2="50"
        stroke={person1Color}
        stroke-width="2"
      />

      {/* Person 2 */}
      <circle cx="70" cy="50" r="10" fill={person2Color}>
        <text x="66" y="54" font-size="12" font-weight="bold" fill="white">
          $
        </text>
      </circle>
      <line
        x1="70"
        y1="50"
        x2="80"
        y2="50"
        stroke={person2Color}
        stroke-width="2"
      />

      {/* Bill */}
      <path
        d="M45,30 L55,30 L52,70 L48,70 Z"
        fill="#3caea3"
        stroke="#2f7a6d"
        stroke-width="2"
      />
    </svg>
  );
};

export default SplitBillIcon;
