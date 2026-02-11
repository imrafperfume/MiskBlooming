// MapEmbed.tsx
import React from "react";

type MapEmbedProps = {
  height?: number | string;
  className?: string;
  src?: string;
};

const MapEmbed: React.FC<MapEmbedProps> = ({ height = 450, className, src }) => {
  return (
    <iframe
      src={src}
      style={{ border: 0, width: "100%", height }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={className}
    />
  );
};

export default MapEmbed;
