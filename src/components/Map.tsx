// MapEmbed.tsx
import React from "react";

type MapEmbedProps = {
  height?: number | string;
  className?: string;
};

const MapEmbed: React.FC<MapEmbedProps> = ({ height = 450, className }) => {
  return (
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3604.8382582383615!2d55.51103527538761!3d25.376736677595837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ef5f7252c2a0803%3A0x581b3a6b55993cc9!2sMISK%20BLOOMING!5e0!3m2!1sen!2sbd!4v1757353025369!5m2!1sen!2sbd"
      style={{ border: 0, width: "100%", height }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={className}
    />
  );
};

export default MapEmbed;
