import React, { useRef, useEffect, useState } from "react";

type PlayerProps = {
  hslUrl: string;
  thumbnailsUrl: string;
  posterUrl: string;
  videoId: string;
  trimStart?: number;
  trimEnd?: number;
};

const Player: React.FC<PlayerProps> = ({
  hslUrl,
  thumbnailsUrl,
  posterUrl,
  videoId,
  trimStart = 0,
  trimEnd = Infinity,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => setDuration(video.duration);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => video.removeEventListener("loadedmetadata", handleLoadedMetadata);
  }, []);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        controls
        src={hslUrl}
        poster={posterUrl}
        className="w-full"
      />
      {duration > 0 && trimStart < trimEnd && (
        <div
          className="absolute bottom-0 left-0 h-1 bg-indigo-500 bg-opacity-50"
          style={{
            left: `${(trimStart / duration) * 100}%`,
            width: `${((trimEnd - trimStart) / duration) * 100}%`,
          }}
        />
      )}
    </div>
  );
};

export default Player;