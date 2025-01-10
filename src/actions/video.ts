import axiosInstance from "@/axios";

export async function getPreviewVideo(id: string) {
  console.log(id)
	try {
		const response = await axiosInstance.get(`/api/video-service/${id}/video`);
		return response.data;
	} catch (error) {
		console.error(error);
		throw error.response.data;
	}
}
