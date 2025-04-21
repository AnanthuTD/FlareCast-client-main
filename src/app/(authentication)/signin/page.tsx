"use client";
import React, { useState } from "react";
import { signInWithCredential } from "@/actions/auth";
import { Button } from "@/components/signIn/Button";
import { Divider } from "@/components/signIn/Divider";
import useZodForm from "@/hooks/useZodForm";
import { emailSchema } from "./schema";
import GoogleSignIn from "@/components/auth/GoogleSignIn";
import { useUserStore } from "@/providers/UserStoreProvider";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

function buttonText(
	signInMethod: "google" | "credential" | null,
	isPending: boolean,
	errors: { email: any; password: any }
) {
	if (isPending) {
		return "Processing...";
	} else if (signInMethod === "google") {
		return "Continue with google";
	} else if (signInMethod === "credential") {
		return "Continue";
	} else if (errors.email) {
		return "Continue";
	}
	return "Create account";
}

export default function SignIn() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const setUser = useUserStore((state) => state.setUser);
	const [isPending, setIsPending] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		trigger,
	} = useZodForm(emailSchema, () => {});

	const onFormSubmit = async ({
		email,
		password,
	}: {
		email: string;
		password: string;
	}) => {
		setIsPending(true);
		try {
			const callbackUrl = searchParams.get("callbackUrl");

			const userData = await signInWithCredential(
				email,
				password,
				!!callbackUrl
			);

			if (callbackUrl) {
				window.location.href = `${callbackUrl}?refreshToken=${userData.refreshToken}`;
			} else {
				setUser(userData);
				router.replace("/home");
			}
		} catch (error) {
			toast.error(typeof error === "string" ? error : "Something went wrong!", {
				description: "Try again",
			});
			console.error(error);
		} finally {
			setIsPending(false);
		}
	};

	const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const email = e.currentTarget.email.value;
		const password = e.currentTarget.password.value;

		handleSubmit(() => onFormSubmit({ email, password }))(e);
	};

	return (
		<div className="flex flex-col justify-center align-center h-full">
			<h1 className="text-3xl font-bold tracking-tighter leading-none text-center text-neutral-800 max-md:mt-10">
				Sign in to FlareCast
			</h1>

			<GoogleSignIn />

			<Divider text="or" />

			<form onSubmit={handleFormSubmit} className="w-[448px] max-w-full">
				<label
					htmlFor="email"
					className="block mt-9 text-sm leading-loose text-neutral-800"
				>
					Email address
				</label>
				<input
					id="email"
					{...register("email")}
					onBlur={() => trigger("email")}
					placeholder="Enter your email to continue…"
					className={`w-full overflow-hidden px-4 py-3 mt-2.5 text-sm leading-relaxed bg-white rounded-2xl text-neutral-800 outline ${
						errors.email ? "outline-red-500" : "outline-gray-400"
					}`}
					required
					aria-label="Email address"
				/>
				{errors.email && (
					<p className="mt-1 text-sm text-red-500">
						{errors.email.message?.toString()}
					</p>
				)}

				<label
					htmlFor="password"
					className="block mt-9 text-sm leading-loose text-neutral-800"
				>
					Password
				</label>
				<input
					id="password"
					{...register("password")}
					onBlur={() => trigger("password")}
					placeholder="Enter your email to continue…"
					className={`w-full overflow-hidden px-4 py-3 mt-2.5 text-sm leading-relaxed bg-white rounded-2xl text-neutral-800 outline ${
						errors.password ? "outline-red-500" : "outline-gray-400"
					}`}
					required
					aria-label="Password"
				/>
				{errors.password && (
					<p className="mt-1 text-sm text-red-500">
						{errors.password.message?.toString()}
					</p>
				)}

				<Button type="submit" disabled={isPending}>
					{buttonText("credential", isPending, errors)}
				</Button>
			</form>

			<div className="flex gap-2.5 items-start pt-6 pr-24 pl-24 text-sm leading-6 max-md:px-5 max-md:max-w-full">
				<span className="text-neutral-800">
					Don&apos;t have an account yet?
				</span>
				<Link href="/signup" passHref>
					<button className="font-bold text-indigo-500">
						Sign up for free
					</button>
				</Link>
			</div>
		</div>
	);
}
