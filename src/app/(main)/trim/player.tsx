"use client";
import React, { useRef, useEffect, useState } from "react";

type PlayerProps = {
  hslUrl: string;
  thumbnailsUrl: string;
  posterUrl: string;
  videoId: string;
  trimStart?: number;
  trimEnd?: number;
  previewTime?: number; // For real-time preview
};

const Player: React.FC<PlayerProps> = ({
  hslUrl,
  thumbnailsUrl,
  posterUrl,
  videoId,
  trimStart = 0,
  trimEnd = Infinity,
  previewTime,
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video || previewTime === undefined || isNaN(previewTime)) return;

    // Seek to previewTime if within trimmed range
    if (previewTime >= trimStart && previewTime <= trimEnd) {
      video.currentTime = previewTime;
      video.play().catch((error) => console.error("Auto-play failed:", error));
    }
  }, [previewTime, trimStart, trimEnd]);

  return (
    <div className="relative w-2/3 rounded-md overflow-hidden">
      <video
        ref={videoRef}
        controls
        src={hslUrl}
        poster={posterUrl}
        className="w-full"
        autoPlay={false}
      />
      {duration > 0 && trimStart < trimEnd && (
        <div
          className="absolute bottom-0 left-0 h-1 bg-indigo-300 bg-opacity-50"
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