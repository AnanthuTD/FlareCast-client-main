"use client";
import React, { useEffect, useState } from "react";
import { checkUserExists, signInWithCredential } from "@/actions/auth";
import { Button } from "@/components/signIn/Button";
import { Divider } from "@/components/signIn/Divider";
import { useMutationData } from "@/hooks/useMutationData";
import useZodForm from "@/hooks/useZodForm";
import { emailSchema } from "./schema";
import GoogleSignIn from "@/components/auth/GoogleSignIn";
import AuthLayoutWrapper from "@/components/auth/AuthLayoutWrapper";
import { useUserStore } from "@/providers/UserStoreProvider";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

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
	const [trigger, setTrigger] = useState(false);
	const searchParams = useSearchParams();
	const router = useRouter();
	const [signInMethod, setSignInMethod] = React.useState<
		"google" | "credential" | null
	>(null);
	const setUser = useUserStore((state) => state.setUser);

	const { mutate, error, isPending, data } = useMutationData(
		["check-user-exists"],
		checkUserExists,
		"check-user-exists"
	);

	const {
		register,
		onFormSubmit: onEmailChange,
		errors,
	} = useZodForm(emailSchema, () => {});

	useEffect(() => {
		// console.log()
		if (data) {
			setSignInMethod(data.method);
		}
	}, [data]);

	useEffect(() => {
		if (errors.email) {
			setSignInMethod(null);
		}
	}, [error, errors.email]);

	const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const callbackUrl = searchParams.get("callbackUrl");

		console.log("Submit clicked");

		/* if (signInMethod === "google") {
			console.log("Google sign in");
			setTrigger(true);
		} else if (signInMethod === "credential") { */
			const userData = await signInWithCredential(
				e.currentTarget.email.value,
				e.currentTarget.password.value,
				!!callbackUrl
			);

			if (!error) {
				if (callbackUrl) {
					// if callbackUrl then redirect back to it
					window.location.href = `${callbackUrl}?refreshToken=${userData.refreshToken}`;
				} else {
					setUser(userData);
					router.replace("/home");
				}
			}
	/* 	} else {
			console.log("Unknown signin method");
		} */
	};

	return (
		<AuthLayoutWrapper page="signin">
			<div className="flex flex-col justify-center align-center h-full">
				<h1 className="text-3xl font-bold tracking-tighter leading-none text-center text-neutral-800 max-md:mt-10">
					Sign in to FlareCast
				</h1>

				<GoogleSignIn trigger={trigger} setTrigger={setTrigger} />

				<Divider text="or" />

				<form
					onChange={onEmailChange}
					onSubmit={onFormSubmit}
					className="w-[448px] max-w-full"
				>
					<label
						htmlFor="email"
						className="block mt-9 text-sm leading-loose text-neutral-800"
					>
						Email address
					</label>
					<input
						id="email"
						{...register("email")}
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

					{(signInMethod === "credential" || true) && (
						<>
							<label
								htmlFor="password"
								className="block mt-9 text-sm leading-loose text-neutral-800"
							>
								Password
							</label>
							<input
								id="password"
								{...register("password")}
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
						</>
					)}

					<Button type="submit" /* disabled={isPending} */>
						{buttonText("credential", /* isPending */ false, errors)}
					</Button>
				</form>

				{error && (
					<p className="mt-4 text-sm text-red-500">
						{error.message || "An error occurred. Please try again."}
					</p>
				)}

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
		</AuthLayoutWrapper>
	);
}
