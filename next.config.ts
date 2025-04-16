import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	rewrites: async () => {
		return [
			{
				source: "/api/:path*",
				destination: process.env.NEXT_PUBLIC_API_GATEWAY_URL + "/api/:path*", // Proxy to user-service
			},
			{
				source: "/gcs/:path*",
				destination: process.env.NEXT_PUBLIC_GCS_URL + "/:path*", // Proxy to Google Cloud Storage
			},
			{
				source: "/s3/:path*",
				destination: process.env.NEXT_PUBLIC_GCS_URL + "/:path*", // Proxy to s3 storage
			},
		];
	},
	images: {
		domains: [
			"cdn.builder.io",
			"lh3.googleusercontent.com",
			"d1j5jvhpjcqj6b.cloudfront.net",
		],
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	reactStrictMode: false,
};

export default nextConfig;
