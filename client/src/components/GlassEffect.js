import React, { useRef } from "react";

const GlassEffect = ({
  diameter = 200, // Width and height are equal for a circle
  borderRadius = "50%", // Ensures the shape is a circle
  children,
  style = {},
}) => {
  const svgRef = useRef(null);

  return (
    <>
      {/* Hidden SVG with the filter definition */}
      <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
        <svg
          ref={svgRef}
          width={diameter}
          height={diameter}
          viewBox={`0 0 ${diameter} ${diameter}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="displacementFilter">
            <feImage
              href={`data:image/svg+xml,%3Csvg width='${diameter}' height='${diameter}' viewBox='0 0 ${diameter} ${diameter}' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='${
                diameter / 4
              }' y='${diameter / 4}' width='${diameter / 2}' height='${
                diameter / 2
              }' rx='${borderRadius}' fill='%230001' /%3E%3Crect x='${
                diameter / 4
              }' y='${diameter / 4}' width='${diameter / 2}' height='${
                diameter / 2
              }' rx='${borderRadius}' fill='%23FFF' style='filter:blur(5px)' /%3E%3C/svg%3E`}
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              result="thing9"
            />
            <feImage
              href={`data:image/svg+xml,%3Csvg width='${diameter}' height='${diameter}' viewBox='0 0 ${diameter} ${diameter}' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='${
                diameter / 4
              }' y='${diameter / 4}' width='${diameter / 2}' height='${
                diameter / 2
              }' rx='${borderRadius}' fill='%23FFF1' style='filter:blur(15px)' /%3E%3C/svg%3E`}
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              result="thing0"
            />
            <feImage
              href={`data:image/svg+xml,%3Csvg width='${diameter}' height='${diameter}' viewBox='0 0 ${diameter} ${diameter}' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='${
                diameter / 4
              }' y='${diameter / 4}' width='${diameter / 2}' height='${
                diameter / 2
              }' rx='${borderRadius}' fill='%23000' /%3E%3C/svg%3E`}
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              result="thing1"
            />
            <feImage
              href={`data:image/svg+xml,%3Csvg width='${diameter}' height='${diameter}' viewBox='0 0 ${diameter} ${diameter}' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='gradient1' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' stop-color='%23000'/%3E%3Cstop offset='100%25' stop-color='%2300F'/%3E%3C/linearGradient%3E%3ClinearGradient id='gradient2' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23000'/%3E%3Cstop offset='100%25' stop-color='%230F0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='0' y='0' width='${diameter}' height='${diameter}' rx='${borderRadius}' fill='%237F7F7F' /%3E%3Crect x='${
                diameter / 4
              }' y='${diameter / 4}' width='${diameter / 2}' height='${
                diameter / 2
              }' rx='${borderRadius}' fill='%23000' /%3E%3Crect x='${
                diameter / 4
              }' y='${diameter / 4}' width='${diameter / 2}' height='${
                diameter / 2
              }' rx='${borderRadius}' fill='url(%23gradient1)' style='mix-blend-mode: screen' /%3E%3Crect x='${
                diameter / 4
              }' y='${diameter / 4}' width='${diameter / 2}' height='${
                diameter / 2
              }' rx='${borderRadius}' fill='url(%23gradient2)' style='mix-blend-mode: screen' /%3E%3Crect x='${
                diameter / 4
              }' y='${diameter / 4}' width='${diameter / 2}' height='${
                diameter / 2
              }' rx='${borderRadius}' fill='%237F7F7FBB' style='filter:blur(5px)' /%3E%3C/svg%3E`}
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              result="thing2"
            />
            <feDisplacementMap
              in2="thing2"
              in="SourceGraphic"
              scale="-148"
              xChannelSelector="B"
              yChannelSelector="G"
            />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="disp1"
            />
            <feDisplacementMap
              in2="thing2"
              in="SourceGraphic"
              scale="-150"
              xChannelSelector="B"
              yChannelSelector="G"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="disp2"
            />
            <feDisplacementMap
              in2="thing2"
              in="SourceGraphic"
              scale="-152"
              xChannelSelector="B"
              yChannelSelector="G"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="disp3"
            />
            <feBlend in2="disp2" mode="screen" />
            <feBlend in2="disp1" mode="screen" />
            <feGaussianBlur stdDeviation="0.7" />
            <feBlend in2="thing0" mode="screen" />
            <feBlend in2="thing9" mode="multiply" />
            <feComposite in2="thing1" operator="in" />
            <feOffset dx="43" dy="43" />
          </filter>
        </svg>
      </div>

      {/* Wrapper div that applies the glass effect */}
      <div
        style={{
          width: `${diameter}px`,
          height: `${diameter}px`,
          backdropFilter: "url(#displacementFilter)",
          borderRadius: `${borderRadius}`,
          overflow: "hidden",
          position: "absolute", // Position it absolutely
          left: "50%", // Horizontally center
          bottom: 0, // Align to the bottom
          transform: "translateX(-50%)", // Offset by 50% of its own width to truly center
          ...style, // Allow overriding by external styles
        }}
      >
        {children}
      </div>
    </>
  );
};

export default GlassEffect;
