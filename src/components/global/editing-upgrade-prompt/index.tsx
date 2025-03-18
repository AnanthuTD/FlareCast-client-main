import { Button } from "@/components/ui/button";
import React from "react";
import Loader from "../loader";
import { Scissors, Link2 } from "lucide-react"; // Replaced AI-related icons with editing-related ones
import Link from "next/link";

const EditingUpgradePrompt = () => {
	return (
		<div className="p-5 bg-white rounded-xl flex flex-col gap-y-6">
			<div className="flex items-center gap-4">
				<div className="w-full">
					<h2 className="text-3xl font-bold text-gray-900">Editing Features</h2>
					<p className="text-gray-600">
						Upgrade to unlock powerful trimming and merging tools for your
						videos!
					</p>
				</div>

				<div className="flex gap-4 w-full justify-end">
					<Button className="mt-2 text-sm bg-indigo-400 text-white hover:bg-indigo-500">
						<Loader state={false} color="#FFFFFF">
							Try Now
						</Loader>
					</Button>
					<Link href={'/upgrade'}>
						<Button
							className="mt-2 text-sm bg-white text-indigo-400 border border-indigo-400 hover:bg-indigo-50"
							variant="secondary"
						>
							<Loader state={false} color="#818CF8">
								Upgrade Now
							</Loader>
						</Button>
					</Link>
				</div>
			</div>
			<div className="border-[1px] border-indigo-200 rounded-xl p-4 gap-4 flex flex-col bg-indigo-50">
				<div className="flex items-center gap-2">
					<h2 className="text-2xl font-bold text-indigo-400">Editing Suite</h2>
					{/* Removed StarsIcon since it’s AI-specific */}
				</div>
				<div className="flex gap-2 items-start">
					<div className="p-2 rounded-full border-indigo-300 border-[2px] bg-white">
						<Scissors color="#818CF8" /> {/* Icon for trimming */}
					</div>
					<div className="flex flex-col">
						<h3 className="text-md text-gray-900">Trimming</h3>
						<p className="text-gray-500 text-sm">
							Cut and refine your video by removing unwanted sections with ease.
						</p>
					</div>
				</div>
				<div className="flex gap-2 items-start">
					<div className="p-2 rounded-full border-indigo-300 border-[2px] bg-white">
						<Link2 color="#818CF8" /> {/* Icon for merging */}
					</div>
					<div className="flex flex-col">
						<h3 className="text-md text-gray-900">Merging</h3>
						<p className="text-gray-500 text-sm">
							Combine multiple video clips into a single seamless file.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EditingUpgradePrompt;
