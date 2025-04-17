import Image from "next/image";
import { Card } from "@/components/ui/card";
import {
	BrainIcon,
	CheckCircle2Icon,
	RadioTowerIcon,
	Users2Icon,
	VideoIcon,
} from "lucide-react";

const FeaturesSection: React.FC = () => {
	return (
		<section id="features" className="py-20 bg-white">
			<div className="container mx-auto px-6">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						Powerful Features for Seamless Collaboration
					</h2>
					<p className="text-lg text-indigo-900/70 max-w-2xl mx-auto">
						Everything you need to record, share, and collaborate on video
						content with your team.
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					<Card className="p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100 hover:border-[#6366F1]/20 h-full">
						<div className="h-14 w-14 rounded-full bg-[#6366F1]/10 flex items-center justify-center mb-6">
							<VideoIcon color="#6366F1" />
						</div>
						<h3 className="text-xl font-bold mb-3">Instant Recording</h3>
						<p className="text-indigo-900/70">
							Capture your screen, camera, or both with a single click. No
							complicated setup required.
						</p>
					</Card>
					<Card className="p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100 hover:border-[#6366F1]/20 h-full">
						<div className="h-14 w-14 rounded-full bg-[#6366F1]/10 flex items-center justify-center mb-6">
							<RadioTowerIcon color="#6366F1" />
						</div>
						<h3 className="text-xl font-bold mb-3">Live Streaming</h3>
						<p className="text-indigo-900/70">
							Stream your content in real-time to your team members for
							immediate feedback and collaboration.
						</p>
					</Card>
					<Card className="p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100 hover:border-[#6366F1]/20 h-full">
						<div className="h-14 w-14 rounded-full bg-[#6366F1]/10 flex items-center justify-center mb-6">
							<Users2Icon color="#6366F1" />
						</div>
						<h3 className="text-xl font-bold mb-3">Team Collaboration</h3>
						<p className="text-indigo-900/70">
							Organize videos in workspaces and folders, add comments, and share
							with your team effortlessly.
						</p>
					</Card>
					<Card className="p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100 hover:border-[#6366F1]/20 h-full">
						<div className="h-14 w-14 rounded-full bg-[#6366F1]/10 flex items-center justify-center mb-6">
							<BrainIcon color="#6366F1" />
						</div>
						<h3 className="text-xl font-bold mb-3">AI-Powered Tools</h3>
						<p className="text-indigo-900/70">
							Generate titles, summaries, and transcriptions automatically with
							our advanced AI technology.
						</p>
					</Card>
				</div>
				<div className="mt-20">
					<div className="flex flex-col md:flex-row items-center">
						<div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
							<h3 className="text-2xl md:text-3xl font-bold mb-4">
								Advanced Workspace Management
							</h3>
							<p className="text-lg text-indigo-900/70 mb-6">
								Keep your video content organized with customizable workspaces
								and folders. Share access with team members and control
								permissions with ease.
							</p>
							<ul className="space-y-3">
								<li className="flex items-start">
									<CheckCircle2Icon className="text-[#6366F1] mt-1 mr-3" />
									<span>Unlimited workspaces for different projects</span>
								</li>
								<li className="flex items-start">
									<CheckCircle2Icon className="text-[#6366F1] mt-1 mr-3" />
									<span>Granular permission controls</span>
								</li>
								<li className="flex items-start">
									<CheckCircle2Icon className="text-[#6366F1] mt-1 mr-3" />
									<span>Real-time updates with WebSocket technology</span>
								</li>
							</ul>
						</div>
						<div className="md:w-1/2">
							<Image
								src="https://readdy.ai/api/search-image?query=Professional%20workspace%20management%20interface%20with%20folders%20and%20collaboration%20features%2C%20modern%20UI%20design%20with%20purple%20accents%2C%20organized%20video%20content%20in%20a%20clean%20layout%2C%20team%20collaboration%20dashboard%20with%20user%20avatars%2C%20professional%20software%20interface%2C%20high-quality%20screen%20display&width=600&height=400&seq=workspace-ui-1&orientation=landscape"
								alt="Workspace Management"
								width={600}
								height={400}
								className="rounded-lg shadow-xl"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default FeaturesSection;
