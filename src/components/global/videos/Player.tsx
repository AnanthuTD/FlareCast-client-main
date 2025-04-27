"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { postView } from "@/actions/video";
import { VideoType } from "@/types";

interface PlayerProps {
  hslUrl: string;
  thumbnailsUrl: string;
  posterUrl: string;
  videoId: string;
  type?: VideoType;
}

function Player({
  hslUrl,
  thumbnailsUrl,
  posterUrl,
  videoId,
  type = "VOD",
}: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const isLive = type === "LIVE";

  const initializePlayer = useCallback(() => {
    const source = hslUrl;
    const video = videoRef.current;
    if (!video) return;

    // Cleanup previous instances
    if (hlsRef.current) hlsRef.current.destroy();
    if (playerRef.current) playerRef.current.destroy();

    const hlsLiveStreamConfig = {
      autoStartLoad: true,
      liveSyncDurationCount: 4, // Buffer 8s ahead of live edge (4 * 2s)
      liveMaxLatencyDurationCount: 12, // Allow 24s latency
      // liveDurationInfinity: true,
      maxBufferLength: 60, // Buffer up to 60s ahead
      maxMaxBufferLength: 120,
      manifestLoadingTimeOut: 15000,
      manifestLoadingMaxRetry: 5,
      levelLoadingMaxRetry: 5,
      fragLoadingMaxRetry: 5,
      backBufferLength: Infinity, // Retain all past segments for seeking
    };

    if (Hls.isSupported()) {
      hlsRef.current = new Hls({
        ...(isLive ? hlsLiveStreamConfig : {}),
        debug: true,
      });

      hlsRef.current.loadSource(source);
      hlsRef.current.attachMedia(video);

      hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
        setError(null);
        const levels = hlsRef.current?.levels.map((level) => level.height) || [];

        playerRef.current = new Plyr(video, {
          controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "duration",
            "mute",
            "volume",
            "settings",
            "fullscreen",
          ],
          settings: ["quality"],
          quality: {
            default: "auto",
            options: ["auto", ...levels],
            forced: true,
            onChange: (quality: string | number) => {
              if (hlsRef.current) {
                if (quality === "auto") {
                  hlsRef.current.currentLevel = -1;
                } else {
                  const levelIndex = levels.indexOf(quality as number);
                  if (levelIndex !== -1) hlsRef.current.currentLevel = levelIndex;
                }
              }
            },
          },
          previewThumbnails: !isLive && thumbnailsUrl
            ? { enabled: true, src: thumbnailsUrl }
            : { enabled: false },
        });

        if (isLive) {
          // Start near live edge for live streams
          const liveEdge = video.seekable.length
            ? video.seekable.end(video.seekable.length - 1)
            : 0;
          video.currentTime = liveEdge;
          video.play().catch(() => console.log("Autoplay blocked"));
        } else {
          // Start at beginning for VOD
          video.currentTime = 0; // Explicitly set to 0 for consistency
          video.play().catch(() => console.log("Autoplay blocked"));
        }
      });

      hlsRef.current.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS Error:", data);
        setError(`Stream Error: ${data.type} - ${data.details}`);

        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log("Network error, retrying...");
              hlsRef.current?.startLoad();
              setTimeout(() => {
                if (hlsRef.current?.levels.length) {
                  hlsRef.current.currentLevel = 0;
                }
              }, 2000);
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log("Media error, recovering...");
              hlsRef.current?.recoverMediaError();
              break;
            default:
              console.log("Unrecoverable error, reinitializing...");
              setTimeout(() => initializePlayer(), 5000);
              break;
          }
        } else if (data.details === Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
          console.log("Buffer stall, nudging playback...");
          hlsRef.current?.startLoad();
        } else if (data.details === Hls.ErrorDetails.LEVEL_LOAD_ERROR) {
          console.log("Level load error, switching to available level...");
          if (hlsRef.current?.levels.length) {
            hlsRef.current.currentLevel = hlsRef.current.levels.length - 1;
          }
        }
      });

      hlsRef.current.on(Hls.Events.BUFFER_APPENDED, () => {
        const buffered = video.buffered;
        if (buffered.length > 0) {
          console.log(`Buffer range: ${buffered.start(0)} - ${buffered.end(0)}`);
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      playerRef.current = new Plyr(video, {
        controls: [
          "play-large",
          "play",
          "progress",
          "current-time",
          "duration",
          "mute",
          "volume",
          "settings",
          "fullscreen",
        ],
      });

      console.log("Type:", type, "Is Live:", isLive);
      if (isLive) {
        video.addEventListener("loadedmetadata", () => {
          const liveEdge = video.seekable.length
            ? video.seekable.end(video.seekable.length - 1)
            : 0;
          video.currentTime = liveEdge;
          video.play().catch(() => console.log("Autoplay blocked"));
        });
      } else {
        video.addEventListener("loadedmetadata", () => {
          video.currentTime = 0; // Start at beginning for VOD
          video.play().catch(() => console.log("Autoplay blocked"));
        });
      }
    }
  }, [hslUrl, thumbnailsUrl, videoId, type]);

  useEffect(() => {
    initializePlayer();
    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
      if (playerRef.current) playerRef.current.destroy();
    };
  }, [initializePlayer]);

  return (
    <div ref={containerRef} className="plyr-react plyr relative">
      <video
        ref={videoRef}
        controls
        playsInline
        poster={posterUrl}
        className="w-full"
        onPlay={() => postView(videoId)}
      />
      {/* {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="text-white text-center">
            <p>{error}</p>
            <button
              onClick={() => {
                setError(null);
                initializePlayer();
              }}
              className="mt-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default Player;