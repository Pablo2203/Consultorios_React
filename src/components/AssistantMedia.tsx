import React, { useEffect, useMemo, useState } from "react";

type Props = {
  srcWebm: string;
  fallbackPng: string;
  className?: string;
  alt?: string;
  loop?: boolean;
  muted?: boolean;
  autoPlay?: boolean;
};

const AssistantMedia: React.FC<Props> = ({
  srcWebm,
  fallbackPng,
  className,
  alt = "",
  loop = true,
  muted = true,
  autoPlay = true,
}) => {
  const canPlayWebmVp9 = useMemo(() => {
    if (typeof document === "undefined") return false;
    const v = document.createElement("video");
    // vp9 webm; algunos navegadores no soportan alpha, pero esto cubre compatibilidad básica
    return !!v.canPlayType && v.canPlayType('video/webm; codecs="vp9"') !== "";
  }, []);

  const [useVideo, setUseVideo] = useState(canPlayWebmVp9);

  useEffect(() => {
    setUseVideo(canPlayWebmVp9);
  }, [canPlayWebmVp9]);

  if (!useVideo) {
    return <img src={fallbackPng} alt={alt} className={className} />;
  }

  return (
    <video
      src={srcWebm}
      className={className}
      loop={loop}
      muted={muted}
      autoPlay={autoPlay}
      playsInline
      onError={() => setUseVideo(false)}
    />
  );
};

export default AssistantMedia;

