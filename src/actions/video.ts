import axiosInstance from "@/axios";

export async function getPreviewVideo(id: string) {
	console.log(id);
	try {
		const response = await axiosInstance.get(`/api/video-service/${id}/video`);
		return response.data;
	} catch (error) {
		console.error(error);
		throw error.response.data;
	}
}

export async function postView(videoId: string) {
	try {
		await axiosInstance.patch(
			`/api/video-service/video/${videoId}/viewed`
		);
	} catch (error) {
		console.error(error);
		throw error.response.data;
	}
}
