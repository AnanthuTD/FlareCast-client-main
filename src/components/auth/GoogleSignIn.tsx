import React, { useEffect, useState } from "react";
import { useGoogleLogin, TokenResponse } from "@react-oauth/google";
import axiosInstance from "@/axios";
import { toast, Toaster } from "sonner";
import axios from "axios";
import { GoogleSignInButton } from "@/components/signIn/GoogleSignInButton";
import { useUserStore } from "@/providers/UserStoreProvider";
import { useRouter, useSearchParams } from "next/navigation";

interface GoogleSignInResponse {
	message: string;
	token: string;
	user: {
		id: string;
		email: string;
		name: string;
	};
}

const GoogleSignIn: React.FC = ({ trigger = false, setTrigger = () => {} }) => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const setUser = useUserStore((state) => state.setUser);

	const handleGoogleLoginSuccess = (user: any) => {
		const callbackUrl = searchParams.get("callbackUrl");
		if (callbackUrl) {
			console.log("Google login refresh: " + user.refreshToken);
			// if callbackUrl then redirect back to it
			window.location.href = `${callbackUrl}?refreshToken=${user.refreshToken}`;
		} else {
			console.log("Google login success:", user);
			setUser(user);
			router.replace("/home");
		}
	};

	const handleGoogleLoginError = (error: unknown) => {
		if (axios.isAxiosError(error)) {
			toast.error(error.response?.data?.error || "Failed to login with Google");
		} else {
			toast.error("Login failed. Please try again.");
		}
		console.error("Error during Google login:", error);
	};

	const responseGoogle = async (authResult: TokenResponse) => {
		setLoading(true);
		try {
			const { data } = await axiosInstance.post<GoogleSignInResponse>(
				"/api/users/auth/google-sign-in",
				{ code: authResult }
			);
			toast.success("Successfully logged in!", {
				description: "You have successfully logged in with Google.",
			});
			console.log("Login data:", data);
			handleGoogleLoginSuccess(data);
		} catch (error) {
			handleGoogleLoginError(error);
		} finally {
			setLoading(false);
		}
	};

	const googleLogin = useGoogleLogin({
		onSuccess: responseGoogle,
		onError: (error) => {
			console.error("Google login error:", error);
			toast.error("Login failed. Please try again.");
		},
	});

	useEffect(() => {
		if (trigger) {
			googleLogin();
			setTrigger(false);
		}
	}, [trigger, googleLogin, setTrigger]);

	return (
		<div>
			{loading && <div className="spinner">Loading...</div>}
			<GoogleSignInButton onClick={googleLogin} disabled={loading} />
		</div>
	);
};

export default GoogleSignIn;
