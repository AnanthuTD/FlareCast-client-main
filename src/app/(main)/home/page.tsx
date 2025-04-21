import PromotionalVideoGrid from "@/components/global/promotional-video-tab";
import { getQueryClient } from "@/lib/get-query-client";
import axios from "axios";
import React from "react";

const PAGE_LIMIT = 6;
const PAGE_SKIP = 0;

const getVideos = async (category = "PROMOTIONAL") => {
	const { data } = await axios.get(
		`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/videos/public/videos`,
		{
			params: {
				limit: PAGE_LIMIT,
				skip: PAGE_SKIP,
				category,
			},
		}
	);
	return data;
};

async function HomePage() {
	const queryClient = getQueryClient();

	await queryClient.prefetchInfiniteQuery({
		queryKey: ["promotional-video"],
		queryFn: async () => await getVideos("PROMOTIONAL"),
		initialPageParam: null,
	});

	await queryClient.prefetchInfiniteQuery({
		queryKey: ["get-started-video"],
		queryFn: async () => await getVideos("GET_STARTED"),
		initialPageParam: null,
	});

	return (
		<div className="flex flex-col py-px max-w-full">
			<div className="text-lg font-medium tracking-tight leading-7 text-neutral-800 max-md:max-w-full">
				GET STARTED
			</div>
			<div className="flex overflow-hidden flex-wrap gap-3 items-center mt-5 w-full max-md:max-w-full">
				<PromotionalVideoGrid
					category="GET_STARTED"
					queryKey="get-started-video"
				/>
			</div>

			<div className="text-lg font-medium tracking-tight leading-7 text-neutral-800 max-md:max-w-full">
				PROMOTIONAL
			</div>
			<div className="flex overflow-hidden flex-wrap gap-3 items-center mt-5 w-full max-md:max-w-full">
				<PromotionalVideoGrid
					category="PROMOTIONAL"
					queryKey="promotional-video"
				/>
			</div>
		</div>
	);
}

export default HomePage;
