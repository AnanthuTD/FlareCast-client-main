"use client";
import { TabsContent } from "@/components/ui/tabs";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useUserStore } from "@/providers/UserStoreProvider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axiosInstance from "@/axios";

const PersonalSettings = () => {
	const user = useUserStore((state) => state);
	const updateUser = useUserStore((state) => state.setUser);
	const router = useRouter();
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		password: "",
		confirmPassword: "", // Included for completeness
		image: null as File | null,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

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
		}
	}, [user]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Basic file validation (optional: add size/type checks)
			if (!file.type.startsWith("image/")) {
				toast.error("Please select an image file");
				return;
			}
			if (file.size > 5 * 1024 * 1024) {
				// 5MB limit
				toast.error("Image must be less than 5MB");
				return;
			}
			setFormData((prev) => ({ ...prev, image: file }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

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
				`/api/user/profile/update`,
				formDataToSend,
				{
					headers: { "Content-Type": "multipart/form-data" },
				}
			);

			const updatedUser = response.data;
			updateUser(updatedUser);
			toast.success("Profile updated successfully");
			// Uncomment to redirect after success
			// router.push("/settings");
		} catch (error) {
			const errorMessage =
				error.response?.data?.message || error.message || "An error occurred";
			toast.error(`Failed to update profile: ${errorMessage}`);
		} finally {
			setIsLoading(false);
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
								<div className="mt-1 flex items-center gap-4">
									<Input
										id="image"
										type="file"
										accept="image/*"
										onChange={handleImageChange}
										className="bg-white border-indigo-300 text-indigo-900"
									/>
									{formData.image && (
										<span className="text-indigo-600">
											{formData.image.name}
										</span>
									)}
									{user?.image && !formData.image && (
										<img
											src={user.image}
											alt="Current Profile"
											className="w-12 h-12 rounded-full object-cover"
										/>
									)}
								</div>
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
								className="w-full bg-indigo-300 hover:bg-indigo-400 text-white"
							>
								{isLoading ? "Saving..." : "Save Changes"}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</TabsContent>
	);
};

export default PersonalSettings;
