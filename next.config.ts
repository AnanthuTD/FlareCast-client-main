import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/user/:path*",
        destination: process.env.NEXT_PUBLIC_USER_SERVICE_URL + "/api/:path*", // Proxy to user-service
      },
      {
        source: "/api/collaboration/:path*",
        destination: process.env.NEXT_PUBLIC_COLLABORATION_SERVICE_URL + "/:path*", // Proxy to collaboration-service
      },
      {
        source: "/api/video-service/:path*",
        destination: process.env.NEXT_PUBLIC_VIDEO_SERVICE_URL + "/api/:path*", // Proxy to video-service
      },
      {
        source: "/api/notification/:path*",
        destination: process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL + "/api/:path*", // Proxy to video-service
      },
      {
        source: "/gcs/:path*",
        destination: process.env.NEXT_PUBLIC_GCS_URL + "/:path*", // Proxy to Google Cloud Storage
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
	typescript:{
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true
	}
};

export default nextConfig;
