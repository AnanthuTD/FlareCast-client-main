import React, { useRef, useEffect, useState } from "react";
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import "video.js/dist/video-js.css";
import "videojs-contrib-quality-levels"; // Ensure this plugin is installed

interface VideoJSProps {
  options: VideoJsPlayerOptions;
  onReady?: (player: VideoJsPlayer) => void;
}

export const VideoJS: React.FC<VideoJSProps> = ({ options, onReady }) => {
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);
  const [qualityLevels, setQualityLevels] = useState<any[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<number | null>(null);

  useEffect(() => {
    // Initialize Video.js player
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = videojs(videoElement, options, () => {
        videojs.log("Player is ready");
        if (onReady) onReady(player);
      });

      playerRef.current = player;

      // Attach quality levels plugin
      const qualityLevelsPlugin = player.qualityLevels();

      // Add available quality levels to state
      const availableLevels: any[] = [];
      qualityLevelsPlugin.on("addqualitylevel", (event: any) => {
        const qualityLevel = event.qualityLevel;
        availableLevels.push(qualityLevel);
        setQualityLevels([...availableLevels]);
      });

      // Track quality level changes
      qualityLevelsPlugin.on("change", () => {
        const currentIndex = qualityLevelsPlugin.selectedIndex;
        setSelectedQuality(currentIndex);
      });
    } else if (playerRef.current) {
      // Update player source and autoplay dynamically
      const player = playerRef.current;
      player.autoplay(options.autoplay || false);
      player.src(options.sources || []);
    }

    return () => {
      // Cleanup on unmount
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [options, onReady]);

  // Function to switch quality manually
  const handleSwitchQuality = (index: number) => {
    if (playerRef.current) {
      const qualityLevelsPlugin = playerRef.current.qualityLevels();
      for (let i = 0; i < qualityLevelsPlugin.length; i++) {
        qualityLevelsPlugin[i].enabled = i === index;
      }
      setSelectedQuality(index);
    }
  };

  return (
    <div>
      <div data-vjs-player>
        <div ref={videoRef} />
      </div>
      {/* Render quality selection buttons */}
      <div style={{ marginTop: "10px" }}>
        <h3>Available Qualities:</h3>
        {qualityLevels.map((quality, index) => (
          <button
            key={index}
            onClick={() => handleSwitchQuality(index)}
            style={{
              marginRight: "5px",
              backgroundColor: selectedQuality === index ? "#4CAF50" : "#f0f0f0",
              color: selectedQuality === index ? "#fff" : "#000",
              padding: "5px 10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {`${quality.height || "Auto"}p`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VideoJS;
