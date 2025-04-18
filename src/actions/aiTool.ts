import axiosInstance from "@/axios";

export const fetchChats = async (
  videoId: string,
  cursor: string | null,
  limit: number = 10
): Promise<ChatResponse> => {
  const response = await axiosInstance.get(`/api/videos/chats/${videoId}`, {
    params: { cursor, limit },
  });
  return response.data as ChatResponse;
};

export const sendToAiAgent = async (
  videoId: string,
  message: string
): Promise<string> => {
  const response = await axiosInstance.post("/api/videos/chats", {
    videoId,
    query: message,
  });
  return response.data.answer;
};

export const clearSessionHistory = async (sessionId: string): Promise<void> => {
  await axiosInstance.post("/api/videos/chats/clear-session", { sessionId });
};