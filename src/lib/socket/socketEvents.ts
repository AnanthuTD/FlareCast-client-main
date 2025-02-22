export enum SocketEvents {
	MESSAGE = "message",
	USER_JOINED = "user_joined",
	USER_LEFT = "user_left",
	ERROR = "error",

	FOLDER_UPDATES = "folder:updates",
	FOLDER_CREATED = "folder:created",
	FOLDER_DELETED = "folder:deleted",
	FOLDER_RENAMED = "folder:renamed",
}

export interface SocketMessage {
	id: string;
	content: string;
	timestamp: number;
	userId: string;
}
