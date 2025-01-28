// Firebase Messaging Service Worker
importScripts(
	"https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js"
);
importScripts(
	"https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js"
);

// Initialize Firebase
const firebaseConfig = {
	apiKey: "AIzaSyAyTR8uCFps9tsIMY9cnun3_gadQUnnZsk",
	authDomain: "flarecast-f4129.firebaseapp.com",
	projectId: "flarecast-f4129",
	storageBucket: "flarecast-f4129.firebasestorage.app",
	messagingSenderId: "1061019578637",
	appId: "1:1061019578637:web:328f4546c0c09c3cd34044",
	measurementId: "G-BL112N98FB",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
	console.log("Received background message ", payload);
	const notificationTitle = payload.notification?.title || "Default Title";
	const notificationOptions = {
		body: payload.notification?.body || "Default Body",
		icon: payload.notification?.icon || "/flare-cast-icon.svg",
	};

	self.registration.showNotification(notificationTitle, notificationOptions);
});
