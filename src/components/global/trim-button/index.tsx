"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Scissors } from "lucide-react"; 

type Props = {
	videoId: string;
	trim: boolean;
};

const TrimButton = ({ videoId, trim }: Props) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const router = useRouter();

	const handleTrimClick = () => {
		if (trim) {
			// Navigate to trim page for PRO users
			router.push(`/trim/${videoId}`);
		} else {
			// Show subscription modal for non-PRO users
			setIsModalOpen(true);
		}
	};

	return (
		<>
			<Button
				onClick={handleTrimClick}
				className="bg-indigo-300 hover:bg-indigo-400 text-white flex items-center gap-2"
			>
				<Scissors className="h-4 w-4" />
			</Button>

			{/* Subscription Modal for Trim Feature */}
			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent className="bg-white p-6 rounded-lg shadow-lg max-w-md">
					<DialogHeader>
						<DialogTitle className="text-2xl font-bold text-indigo-900">
							Unlock Trim Feature
						</DialogTitle>
						<DialogDescription className="text-gray-600 mt-2">
							To use the trim feature, please subscribe to our PRO plan. Enjoy
							advanced video editing capabilities and more!
						</DialogDescription>
					</DialogHeader>
					<div className="mt-4 flex flex-col gap-4">
						<Button
							className="w-full bg-indigo-300 hover:bg-indigo-400 text-white"
							asChild
						>
							<Link href="/upgrade">Subscribe Now</Link>
						</Button>
						<Button
							onClick={() => setIsModalOpen(false)}
							className="w-full bg-white text-indigo-300 border border-indigo-300 hover:bg-indigo-50"
							variant="outline"
						>
							Cancel
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default TrimButton;
