import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import React from "react";
import Loader from "../loader";
import {
	Bot,
	FileTextIcon,
	Pencil,
	StarsIcon,
} from "lucide-react";
import AiChatBox from "./AiChatBox";
import { SubscriptionPlan } from "@/types";
import Link from "next/link";

type Props = {
	plan: SubscriptionPlan;
	videoId: string;
};

const AiTools = ({ plan, trial, videoId }: Props) => {
	console.log(plan)
	return (
		<TabsContent value="AI Tool">
			{plan?.hasAiFeatures ? (
				<AiChatBox videoId={videoId} />
			) : (
				<div className="p-5 bg-white rounded-xl flex flex-col gap-y-6">
					<div className="flex items-center gap-4">
						<div className="w-full">
							<h2 className="text-3xl font-bold text-gray-900">AI Tools</h2>
							<p className="text-gray-600">
								Taking your video to the next step with the power of AI!
							</p>
						</div>

						<div className="flex gap-4 w-full justify-end">
							<Button className="mt-2 text-sm bg-indigo-400 text-white hover:bg-indigo-500">
								<Loader state={false} color="#FFFFFF">
									Try Now
								</Loader>
							</Button>
							<Link href={"/upgrade"}>
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
							<h2 className="text-2xl font-bold text-indigo-400">
								Flarecast AI
							</h2>
							<StarsIcon color="#818CF8" fill="#818CF8" />
						</div>
						<div className="flex gap-2 items-start">
							<div className="p-2 rounded-full border-indigo-300 border-[2px] bg-white">
								<Pencil color="#818CF8" />
							</div>
							<div className="flex flex-col">
								<h3 className="text-md text-gray-900">Summary</h3>
								<p className="text-gray-500 text-sm">
									Generate a description for your video using AI.
								</p>
							</div>
						</div>
						<div className="flex gap-2 items-start">
							<div className="p-2 rounded-full border-indigo-300 border-[2px] bg-white">
								<FileTextIcon color="#818CF8" />
							</div>
							<div className="flex flex-col">
								<h3 className="text-md text-gray-900">Summary</h3>
								<p className="text-gray-500 text-sm">
									Generate a description for your video using AI.
								</p>
							</div>
						</div>
						<div className="flex gap-2 items-start">
							<div className="p-2 rounded-full border-indigo-300 border-[2px] bg-white">
								<Bot color="#818CF8" />
							</div>
							<div className="flex flex-col">
								<h3 className="text-md text-gray-900">AI Agent</h3>
								<p className="text-gray-500 text-sm">
									Viewers can ask questions on your video and our AI agent will
									respond.
								</p>
							</div>
						</div>
					</div>
				</div>
			)}
		</TabsContent>
	);
};

export default AiTools;
