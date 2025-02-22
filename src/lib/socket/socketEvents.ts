export enum SocketEvents {
  MESSAGE = "message",
  USER_JOINED = "user_joined",
  USER_LEFT = "user_left",
  ERROR = "error",
}

export interface SocketMessage {
  id: string;
  content: string;
  timestamp: number;
  userId: string;
}