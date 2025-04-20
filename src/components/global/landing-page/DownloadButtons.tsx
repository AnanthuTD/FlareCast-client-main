"use client";

import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { toast } from "sonner";
import { GitHubRelease } from "@/types";
import { getOperatingSystem } from "@/lib/getOperatingSystem";

interface DownloadButtonsProps {
	platform: string;
	release: GitHubRelease;
	exts: string[];
	version: string;
	assetSizes: Record<string, string>;
}

export default function DownloadButtons({
	platform,
	release,
	exts,
	version,
	assetSizes,
}: DownloadButtonsProps) {
	const os = getOperatingSystem();

	const getAssetByExt = (ext: string) => {
		if (!release || !release.assets) return null;
		return release.assets.find((asset) =>
			asset.name.toLowerCase().endsWith(`.${ext}`)
		);
	};

	const handleDownload = (ext: string) => {
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
			`Download FlareCast ${release.tag_name} for ${platform}`
		);
		a.click();
		a.remove();
	};

	return (
		<div className="space-y-4">
			{exts.map((ext) => (
				<Button
					key={ext}
					onClick={() => handleDownload(ext)}
					className={`w-full    transition-colors duration-300 rounded-md whitespace-nowrap cursor-pointer  ${
						os.toLowerCase() === platform.toLowerCase()
							? "bg-[#6366F1] text-white hover:bg-[#5254cc]"
							: ""
					}`}
					aria-label={`Download FlareCast ${ext.toUpperCase()} for ${platform}`}
					disabled={!getAssetByExt(ext)}
					variant={
						os.toLowerCase() === platform.toLowerCase() ? "default" : "outline"
					}
				>
					<DownloadIcon className="mr-2 h-4 w-4" />
					Download .{ext} ({assetSizes[ext] || "N/A"})
				</Button>
			))}
			<p className="text-sm text-center text-gray-500">Version {version}</p>
		</div>
	);
}
