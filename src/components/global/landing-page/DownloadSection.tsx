import { Card } from "@/components/ui/card";
import Image from "next/image";
import DownloadButtons from "./DownloadButtons";
import { GitHubRelease } from "@/types";

interface DownloadSectionProps {
	release: GitHubRelease | null;
}

export default function DownloadSection({ release }: DownloadSectionProps) {
	const hasLinuxAssets =
		release?.assets?.some(
			(asset) =>
				asset.name.toLowerCase().endsWith(".snap") ||
				asset.name.toLowerCase().endsWith(".appimage")
		) || false;

	// Precompute asset sizes for each extension
	const assetSizes = {
		msi: "N/A",
		exe: "N/A",
		snap: "N/A",
		appimage: "N/A",
	};

	if (release && release.assets) {
		for (const ext of Object.keys(assetSizes) as Array<
			keyof typeof assetSizes
		>) {
			const asset = release.assets.find((asset) =>
				asset.name.toLowerCase().endsWith(`.${ext}`)
			);
			if (asset) {
				const sizeInMB = asset.size / 1e6;
				assetSizes[ext] = `${sizeInMB.toFixed(1)} MB`;
			}
		}
	}

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
				{!release ? (
					<div className="text-center text-red-500">
						Unable to load download assets. Please try again later.
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
						{/* Windows Card */}
						<Card className="p-8 border border-gray-200 hover:border-[#6366F1]/30 hover:shadow-lg transition-all duration-300">
							<div className="flex items-center justify-center mb-6">
								<Image
									src="/microsoft.png"
									width={50}
									height={50}
									alt="Windows"
								/>
							</div>
							<h3 className="text-xl font-bold text-center mb-2">Windows</h3>
							<p className="text-gray-600 text-center mb-6">
								Windows 10/11 64-bit
							</p>
							<DownloadButtons
								platform="Windows"
								release={release}
								exts={["msi", "exe"]}
								version={release.tag_name.replace(/^v/, "")}
								assetSizes={assetSizes}
							/>
						</Card>

						{/* Linux Card (Conditional) */}
						{hasLinuxAssets && (
							<Card className="p-8 border border-gray-200 hover:border-[#6366F1]/30 hover:shadow-lg transition-all duration-300">
								<div className="flex items-center justify-center mb-6">
									<Image src="/linux.png" width={50} height={50} alt="Linux" />
								</div>
								<h3 className="text-xl font-bold text-center mb-2">Linux</h3>
								<p className="text-gray-600 text-center mb-6">
									Ubuntu, Debian, Fedora
								</p>
								<DownloadButtons
									platform="Linux"
									release={release}
									exts={["snap", "appimage"]}
									version={release.tag_name.replace(/^v/, "")}
									assetSizes={assetSizes}
								/>
							</Card>
						)}
					</div>
				)}
			</div>
		</section>
	);
}
