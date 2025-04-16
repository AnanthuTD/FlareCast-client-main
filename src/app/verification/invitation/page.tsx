"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios, { AxiosError, isAxiosError } from "axios";
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const AcceptInvitationPage: React.FC = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");
	const [isUserSignedUp, setIsUserSignedUp] = useState(false);
	const [workspaceName, setWorkspaceName] = useState("");
	const [invitationToken, setInvitationToken] = useState("");
	const router = useRouter();
	const searchParams = useSearchParams();

	// Extract invitation token from the URL
	useEffect(() => {
		const token = searchParams.get("token");
		if (token) {
			setInvitationToken(token as string);
			handleInvitation(token as string);
		} else {
			setErrorMessage("Token not found");
			setIsLoading(false);
		}
	}, [searchParams]);

	// Handle the invitation acceptance
	const handleInvitation = async (token: string) => {
		try {
			setIsLoading(true);
			const response = await axios.post(
				"/api/invitations/accept",
				{ token }
			);

			// If the response is successful, extract workspace information
			if (response.data.success) {
				setIsUserSignedUp(true);
				setWorkspaceName(response.data.workspaceName); // Assuming response contains workspaceName
			}
		} catch (error: any) {
			if (isAxiosError(error)) {
				// User not found, show error message and prompt for signup
				setErrorMessage(error.response?.data.message);
			} else {
				// Any other error, show generic error
				setErrorMessage("An error occurred while processing your invitation.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	// Redirect to the signup page
	const redirectToSignup = () => {
		router.push(`/signup?invitationToken=${invitationToken}`);
	};

	return (
		<div className="w-full max-w-md mx-auto p-4">
			<h1 className="text-2xl font-semibold text-center mb-6">
				Accept Invitation
			</h1>

			{isLoading ? (
				<div className="text-center text-lg">Loading...</div>
			) : (
				<>
					{isUserSignedUp ? (
						<div className="text-center text-green-500">
							<h2 className="text-xl font-bold">
								You&apos;ve successfully joined the workspace!
							</h2>
							<p>
								Welcome to the workspace: <strong>{workspaceName}</strong>
							</p>
						</div>
					) : (
						<div className="text-center text-red-500">
							<p>{errorMessage}</p>
							<AlertDialog>
								<AlertDialogTrigger>
									<Button
										variant="default"
										className="mt-4"
										onClick={redirectToSignup}
									>
										Sign Up Now
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogTitle>Sign Up Required</AlertDialogTitle>
									<AlertDialogDescription>
										In order to accept the invitation, you need to create an
										account.
									</AlertDialogDescription>
									<AlertDialogAction
										className="bg-red-500 text-white"
										onClick={redirectToSignup}
									>
										Go to Sign Up
									</AlertDialogAction>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default AcceptInvitationPage;
