import Image from "next/image";

const HowItWorks: React.FC = () => {
	return (
		<section id="how-it-works" className="py-20 bg-gray-50">
			<div className="container mx-auto px-6">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						How Flarecast Works
					</h2>
					<p className="text-lg text-indigo-900/70 max-w-2xl mx-auto">
						A simple three-step process to transform your team communication
					</p>
				</div>
				<div className="flex flex-col md:flex-row items-center justify-between">
					<div className="md:w-1/3 mb-10 md:mb-0 px-4 text-center">
						<div className="relative">
							<div className="h-20 w-20 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-6">
								1
							</div>
							<div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-[#6366F1]/30"></div>
						</div>
						<Image
							src="https://readdy.ai/api/search-image?query=Person%20recording%20screen%20with%20professional%20video%20software%2C%20focused%20on%20laptop%20keyboard%20with%20purple%20lighting%20accents%2C%20modern%20workspace%20environment%2C%20clean%20desktop%20setup%2C%20professional%20recording%20session%20in%20progress%2C%20high-quality%20image%20with%20soft%20background&width=300&height=200&seq=step1-img-1&orientation=landscape"
							alt="Record Video"
							width={300}
							height={200}
							className="rounded-lg shadow-lg mx-auto mb-6 w-full max-w-xs"
						/>
						<h3 className="text-xl font-bold mb-3">Record Video</h3>
						<p className="text-indigo-900/70">
							Launch the Flarecast app and record your screen, camera, or both
							with a single click.
						</p>
					</div>
					<div className="md:w-1/3 mb-10 md:mb-0 px-4 text-center">
						<div className="relative">
							<div className="h-20 w-20 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-6">
								2
							</div>
							<div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-[#6366F1]/30"></div>
						</div>
						<Image
							src="https://readdy.ai/api/search-image?query=Person%20sharing%20video%20content%20through%20cloud%20platform%2C%20digital%20sharing%20interface%20with%20purple%20accent%20elements%2C%20modern%20workspace%20with%20sharing%20dialog%20open%2C%20professional%20content%20distribution%20interface%2C%20clean%20minimalist%20design%2C%20high-quality%20image%20with%20soft%20background&width=300&height=200&seq=step2-img-1&orientation=landscape"
							alt="Share Content"
							width={300}
							height={200}
							className="rounded-lg shadow-lg mx-auto mb-6 w-full max-w-xs"
						/>
						<h3 className="text-xl font-bold mb-3">Share Content</h3>
						<p className="text-indigo-900/70">
							Instantly share your video with team members via link or directly
							in your workspace.
						</p>
					</div>
					<div className="md:w-1/3 px-4 text-center">
						<div className="relative">
							<div className="h-20 w-20 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-6">
								3
							</div>
						</div>
						<Image
							src="https://readdy.ai/api/search-image?query=Team%20collaborating%20on%20video%20content%20with%20comments%20and%20feedback%2C%20multiple%20users%20interacting%20with%20video%20interface%2C%20professional%20collaboration%20environment%20with%20purple%20accent%20elements%2C%20modern%20workspace%20with%20team%20avatars%20visible%2C%20clean%20interface%20design%2C%20high-quality%20image%20with%20soft%20background&width=300&height=200&seq=step3-img-1&orientation=landscape"
							alt="Collaborate"
							width={300}
							height={200}
							className="rounded-lg shadow-lg mx-auto mb-6 w-full max-w-xs"
						/>
						<h3 className="text-xl font-bold mb-3">Collaborate</h3>
						<p className="text-indigo-900/70">
							Receive feedback, comments, and collaborate in real-time with your
							team members.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HowItWorks;
