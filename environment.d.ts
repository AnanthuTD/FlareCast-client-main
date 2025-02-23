declare namespace NodeJS {
	interface ProcessEnv {
		NEXT_PUBLIC_DESKTOP_PROTOCOL: string;
		NEXT_PUBLIC_VAPID_KEY: string;

		NEXT_PUBLIC_USER_SERVICE_URL: string;
		NEXT_PUBLIC_COLLABORATION_SERVICE_URL: string;
		NEXT_PUBLIC_VIDEO_SERVICE_URL: string;
		NEXT_PUBLIC_NOTIFICATION_SERVICE_URL: string;
		NEXT_PUBLIC_BACKEND_URL: string;

		NEXT_PUBLIC_GCS_URL: string;
	}
}
