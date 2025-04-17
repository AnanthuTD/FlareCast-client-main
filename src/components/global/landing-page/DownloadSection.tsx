"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GitHubRelease } from "@/types";
import { DownloadIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function getOperatingSystem(): string {
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

const DownloadSection: React.FC = () => {
	const [release, setRelease] = useState<GitHubRelease | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const os = getOperatingSystem();

	useEffect(() => {
		const fetchLatestRelease = async () => {
			try {
				const response = await fetch(
					"https://api.github.com/repos/AnanthuTD/FlareCast-Electron/releases/latest",
					{
						headers: {
							Accept: "application/vnd.github.v3+json",
						},
					}
				);
				if (!response.ok) {
					throw new Error("Failed to fetch release information");
				}
				const data = (await response.json()) as GitHubRelease;
				setRelease(data);
			} catch (err: any) {
				setError(err.message || "An error occurred");
				toast.error("Failed to load release information");
			} finally {
				setLoading(false);
			}
		};
		fetchLatestRelease();
	}, []);

	const getAssetByExt = (ext: string) => {
		if (!release || !release.assets) return null;
		return release.assets.find((asset) =>
			asset.name.toLowerCase().endsWith(`.${ext}`)
		);
	};

	const handleDownload = (ext: string, platform: string) => {
		const asset = getAssetByExt(ext);
		if (!asset) {
			toast.error(`No ${ext.toUpperCase()} download available for ${platform}`);
			return;
		}

		const a = document.createElement("a");
		a.href = asset.browser_download_url;
		a.download = asset.name;
		a.setAttribute(
			"aria-label",
			`Download FlareCast ${release?.tag_name} for ${platform}`
		);
		a.click();
		a.remove();
	};

	const getAssetSize = (ext: string): string => {
		const asset = getAssetByExt(ext);
		if (!asset) return "N/A";
		const sizeInMB = asset.size / 1e6;
		return `${sizeInMB.toFixed(1)} MB`;
	};

	const hasLinuxAssets = release?.assets.some(
		(asset) =>
			asset.name.toLowerCase().endsWith(".snap") ||
			asset.name.toLowerCase().endsWith(".appimage")
	);

	return (
		<section className="py-20 bg-white">
			<div className="container mx-auto px-6">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						Download FlareCast
					</h2>
					<p className="text-lg text-indigo-900/70 max-w-2xl mx-auto">
						Available for Windows{hasLinuxAssets ? " and Linux" : ""}. Start
						recording and collaborating today.
					</p>
				</div>

				{loading && (
					<div className="text-center">
						<p>Loading release information...</p>
					</div>
				)}

				{error && (
					<div className="text-center text-red-600">
						<p>Error: {error}</p>
					</div>
				)}

				{!loading && !error && release && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
						{/* Windows Download */}
						<Card
							className={`p-8 border border-gray-200 hover:border-[#6366F1]/30 hover:shadow-lg transition-all duration-300 ${
								os === "windows" ? "border-2 border-[#6366F1] shadow-lg" : ""
							}`}
						>
							<div className="flex items-center justify-center mb-6">
								<Image
									src={"/microsoft.png"}
									width={50}
									height={50}
									alt="windows"
								/>
							</div>
							<h3 className="text-xl font-bold text-center mb-2">Windows</h3>
							<p className="text-gray-600 text-center mb-6">
								Windows 10/11 64-bit
							</p>
							<div className="space-y-4">
								<Button
									onClick={() => handleDownload("msi", "Windows")}
									className="w-full bg-[#6366F1] text-white hover:bg-[#5254cc] transition-colors duration-300 rounded-md whitespace-nowrap cursor-pointer"
									aria-label="Download FlareCast MSI for Windows"
								>
									<DownloadIcon />
									Download .msi ({getAssetSize("msi")})
								</Button>
								<Button
									onClick={() => handleDownload("exe", "Windows")}
									className="w-full bg-[#6366F1] text-white hover:bg-[#5254cc] transition-colors duration-300 rounded-md whitespace-nowrap cursor-pointer"
									aria-label="Download FlareCast EXE for Windows"
								>
									<DownloadIcon />
									Download .exe ({getAssetSize("exe")})
								</Button>
								<p className="text-sm text-center text-gray-500">
									Version {release.tag_name.replace(/^v/, "")} (
									{getAssetSize("msi")})
								</p>
							</div>
						</Card>

						{/* Linux Download (Conditional) */}
						{hasLinuxAssets && (
							<Card
								className={`p-8 border border-gray-200 hover:border-[#6366F1]/30 hover:shadow-lg transition-all duration-300 ${
									os === "linux" ? "border-2 border-[#6366F1] shadow-lg" : ""
								}`}
							>
								<div className="flex items-center justify-center mb-6">
									<Image
										src={"/linux.png"}
										width={50}
										height={50}
										alt="windows"
									/>
								</div>
								<h3 className="text-xl font-bold text-center mb-2">Linux</h3>
								<p className="text-gray-600 text-center mb-6">
									Ubuntu, Debian, Fedora
								</p>
								<div className="space-y-4">
									<Button
										onClick={() => handleDownload("snap", "Linux")}
										className="w-full bg-[#6366F1] text-white hover:bg-[#5254cc] transition-colors duration-300 rounded-md whitespace-nowrap cursor-pointer"
										aria-label="Download FlareCast Snap for Linux"
										disabled={!getAssetByExt("snap")}
									>
										<DownloadIcon />
										Download .snap ({getAssetSize("snap")})
									</Button>
									<Button
										onClick={() => handleDownload("appimage", "Linux")}
										className="w-full bg-[#6366F1] text-white hover:bg-[#5254cc] transition-colors duration-300 rounded-md whitespace-nowrap cursor-pointer"
										aria-label="Download FlareCast AppImage for Linux"
										disabled={!getAssetByExt("appimage")}
									>
										<DownloadIcon />
										Download .AppImage ({getAssetSize("appimage")})
									</Button>
									<p className="text-sm text-center text-gray-500">
										Version {release.tag_name.replace(/^v/, "")}
									</p>
								</div>
							</Card>
						)}
					</div>
				)}
			</div>
		</section>
	);
};

export default DownloadSection;
