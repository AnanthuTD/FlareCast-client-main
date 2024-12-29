import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	rewrites: async () => {
		return [
			{
				source: "/api/:path*",
				destination: "http://localhost:4000/api/:path*", // Proxy to Backend
			},
		];
	},
	images:{
		domains: ["cdn.builder.io", "lh3.googleusercontent.com"],
	}
};

export default nextConfig;
