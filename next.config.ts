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
				destination: "http://localhost:4002/api/:path*", // Proxy to collaboration-service
			},
		];
	},
	images:{
		domains: ["cdn.builder.io", "lh3.googleusercontent.com"],
	}
};

export default nextConfig;
