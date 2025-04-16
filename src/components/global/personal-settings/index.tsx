"use client";
import { TabsContent } from "@/components/ui/tabs";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"; // shadcn Progress
import { useUserStore } from "@/providers/UserStoreProvider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axiosInstance from "@/axios";
import Image from "next/image";

const PersonalSettings = () => {
	const user = useUserStore((state) => state);
	const updateUser = useUserStore((state) => state.setUser);
	const router = useRouter();
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		password: "",
		confirmPassword: "",
		image: null as File | null,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress
	const [showPassword, setShowPassword] = useState(false);
	const [imagePreview, setImagePreview] = useState<string | null>(null); // Image preview URL

	// Sync form data with user store on mount or user change
	useEffect(() => {
		if (user) {
			setFormData({
				firstName: user.firstName || "",
				lastName: user.lastName || "",
				password: "",
				confirmPassword: "",
				image: null,
			});
			setImagePreview(null); // Reset preview when user changes
		}
	}, [user]);

	// Clean up preview URL when component unmounts or image changes
	useEffect(() => {
		return () => {
			if (imagePreview) URL.revokeObjectURL(imagePreview); // Prevent memory leaks
		};
	}, [imagePreview]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (!file.type.startsWith("image/")) {
				toast.error("Please select an image file");
				return;
			}
			if (file.size > 5 * 1024 * 1024) {
				toast.error("Image must be less than 5MB");
				return;
			}
			// Revoke old preview URL if it exists
			if (imagePreview) URL.revokeObjectURL(imagePreview);
			// Set new file and preview
			setFormData((prev) => ({ ...prev, image: file }));
			setImagePreview(URL.createObjectURL(file));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setUploadProgress(0); // Reset progress

		// Validation
		if (formData.password && formData.password.length < 6) {
			toast.error("Password must be at least 6 characters");
			setIsLoading(false);
			return;
		}
		if (formData.password !== formData.confirmPassword) {
			toast.error("Passwords do not match");
			setIsLoading(false);
			return;
		}
		if (!formData.firstName.trim()) {
			toast.error("First name is required");
			setIsLoading(false);
			return;
		}

		try {
			const formDataToSend = new FormData();
			formDataToSend.append("firstName", formData.firstName);
			formDataToSend.append("lastName", formData.lastName);
			if (formData.password)
				formDataToSend.append("password", formData.password);
			if (formData.image) formDataToSend.append("image", formData.image);

			const response = await axiosInstance.put(
				`/api/users/profile/update`,
				formDataToSend,
				{
					headers: { "Content-Type": "multipart/form-data" },
					onUploadProgress: (progressEvent) => {
						const percentCompleted = Math.round(
							(progressEvent.loaded * 100) / progressEvent.total
						);
						setUploadProgress(percentCompleted); // Update progress
					},
				}
			);

			const updatedUser = response.data;
			updateUser(updatedUser);
			toast.success("Profile updated successfully");
			setImagePreview(null); // Clear preview on successful upload
			// router.push("/settings"); // Uncomment to redirect
		} catch (error) {
			const errorMessage =
				error.response?.data?.message || error.message || "An error occurred";
			toast.error(`Failed to update profile: ${errorMessage}`);
		} finally {
			setIsLoading(false);
			setUploadProgress(0); // Reset progress after completion
		}
	};

	return (
		<TabsContent value="Personal" className="rounded-xl flex flex-col gap-y-6">
			<div className="min-h-screen bg-white p-6">
				<Card className="max-w-2xl mx-auto bg-white shadow-md">
					<CardHeader>
						<h1 className="text-3xl font-bold text-indigo-900">Edit Profile</h1>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<Label htmlFor="firstName" className="text-indigo-700">
									First Name
								</Label>
								<Input
									id="firstName"
									name="firstName"
									value={formData.firstName}
									onChange={handleInputChange}
									className="mt-1 bg-white border-indigo-300 text-indigo-900"
									required
								/>
							</div>
							<div>
								<Label htmlFor="lastName" className="text-indigo-700">
									Last Name (Optional)
								</Label>
								<Input
									id="lastName"
									name="lastName"
									value={formData.lastName}
									onChange={handleInputChange}
									className="mt-1 bg-white border-indigo-300 text-indigo-900"
								/>
							</div>
							<div>
								<Label htmlFor="image" className="text-indigo-700">
									Profile Image
								</Label>
								<div className="mt-1 flex items-center gap-4 flex-wrap">
									<Input
										id="image"
										type="file"
										accept="image/*"
										onChange={handleImageChange}
										className="bg-white border-indigo-300 text-indigo-900"
										disabled={isLoading} // Disable input during upload
									/>
									
									{/* Image Preview */}
									{imagePreview && !isLoading && (
										<Image
											src={imagePreview}
											alt="Preview"
											className="rounded-full object-cover"
											width={50}
											height={50}
										/>
									)}
									{/* Current Profile Image (if no new image selected) */}
									{user?.image && !formData.image && !imagePreview && (
										<Image
											src={user.image + "?t=" + Date.now()}
											alt="Current Profile"
											className="rounded-full object-cover"
											width={50}
											height={50}
										/>
									)}
								</div>
								{/* shadcn Progress Component */}
								{isLoading && formData.image && uploadProgress > 0 && (
									<div className="mt-2 space-y-1">
										<Progress value={uploadProgress} className="w-full" />
										<p className="text-sm text-indigo-700 text-center">
											Uploading: {uploadProgress}%
										</p>
									</div>
								)}
							</div>
							<div>
								<Label htmlFor="password" className="text-indigo-700">
									Change Password (Optional)
								</Label>
								<Input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									value={formData.password}
									onChange={handleInputChange}
									className="mt-1 bg-white border-indigo-300 text-indigo-900"
									placeholder="New password"
								/>
								{formData.password && (
									<div className="mt-4">
										<Label
											htmlFor="confirmPassword"
											className="text-indigo-700"
										>
											Confirm Password
										</Label>
										<Input
											id="confirmPassword"
											name="confirmPassword"
											type={showPassword ? "text" : "password"}
											value={formData.confirmPassword}
											onChange={handleInputChange}
											className="mt-1 bg-white border-indigo-300 text-indigo-900"
											placeholder="Confirm new password"
										/>
									</div>
								)}
								<div className="mt-2">
									<Label className="text-indigo-700">
										<input
											type="checkbox"
											checked={showPassword}
											onChange={(e) => setShowPassword(e.target.checked)}
											className="mr-2"
										/>
										Show Password
									</Label>
								</div>
							</div>
							<Button
								type="submit"
								disabled={isLoading}
								className="w-full bg-indigo-300 hover:bg-indigo-400 text-white flex items-center justify-center"
							>
								{isLoading ? (
									<>
										<svg
											className="animate-spin h-5 w-5 mr-2 text-white"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											></circle>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
											></path>
										</svg>
										Saving...
									</>
								) : (
									"Save Changes"
								)}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</TabsContent>
	);
};

export default PersonalSettings;
