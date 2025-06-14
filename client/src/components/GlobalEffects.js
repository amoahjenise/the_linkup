export const GlobalGlassEffectDefs = () => (
  <div style={{ position: "absolute", top: "-999px", left: "-999px" }}>
    <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg">
      <filter
        id="glassEffectFilter"
        x="-20%"
        y="-20%"
        width="140%"
        height="140%"
      >
        {/* Base blur */}
        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />

        {/* Light effect */}
        <feImage
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%' height='100%' fill='white' opacity='0.2'/%3E%3C/svg%3E"
          result="light"
        />
        <feComposite
          in="light"
          in2="blur"
          operator="in"
          result="light-effect"
        />

        {/* Final composition */}
        <feComposite in="SourceGraphic" in2="light-effect" operator="over" />

        {/* Subtle distortion */}
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.02"
          numOctaves="1"
          result="turbulence"
        />
        <feDisplacementMap
          in2="turbulence"
          in="SourceGraphic"
          scale="3"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  </div>
);
