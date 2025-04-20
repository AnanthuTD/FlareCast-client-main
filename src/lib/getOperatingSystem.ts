"use client";

export function getOperatingSystem(): string {
	if (typeof navigator === "undefined") return "Unknown";

	// userAgentData (experimental)
	if ("userAgentData" in navigator && navigator.userAgentData) {
		const platform = navigator.userAgentData.platform as string;
		if (platform) return platform.toLowerCase();
	}

	// Fallback
	const userAgent = navigator.userAgent.toLowerCase();
	const platform = navigator.platform.toLowerCase();

	if (platform.includes("win")) return "windows";
	if (platform.includes("mac")) return "macos";
	if (platform.includes("linux")) return "linux";
	if (userAgent.includes("android")) return "android";
	if (userAgent.includes("iphone") || userAgent.includes("ipad")) return "ios";
	return "unknown";
}
