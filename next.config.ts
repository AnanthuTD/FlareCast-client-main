import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	rewrites: async () => {
		return [
			{
				source: "/api/user/:path*",
				destination: "http://localhost:4001/api/:path*", // Proxy to user-service
			},
			{
				source: "/api/collaboration/:path*",
				destination: "http://localhost:4002/:path*", // Proxy to collaboration-service
			},
			{
				source: "/api/video-service/:path*",
				destination: "http://localhost:4003/api/:path*", // Proxy to video-service
			},
			{
				source: "/gcs/:path*",
				destination: "https://storage.googleapis.com/flarecast_video_recordings/:path*", // Proxy to Google Cloud Storage
			}
		];
	},
	images: {
		domains: [
			"cdn.builder.io",
			"lh3.googleusercontent.com",
			"https://storage.googleapis.com",
		],
	},
};

export default nextConfig;
