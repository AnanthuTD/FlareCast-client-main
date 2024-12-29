"use client";
import React, { useEffect } from "react";
import { InputField } from "@/components/signup/InputField";
import AuthLayoutWrapper from "@/components/AuthLayoutWrapper";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/signIn/Button";
import useZodForm from "@/hooks/useZodForm";
import { signUp } from "@/actions/auth";
import { signUpSchema } from "./schema";
import { useMutationData } from "@/hooks/useMutationData";
import { toast } from "sonner";
import Link from "next/link";

const SignUpForm: React.FC = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const email = searchParams.get("email");

	const { mutate , error, isPending, data} = useMutationData(["sign-up"], signUp, "signUp", () => {
		toast.success("Account created successfully");
	});

	const { register, errors, onFormSubmit } = useZodForm(signUpSchema, mutate);

	const formFields = [
		{ id: "email", label: "Email address", type: "email" },
		{ id: "firstName", label: "First Name" },
		{ id: "lastName", label: "Last Name" },
		{ id: "password", label: "Password", type: "password" },
	];

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault(); // Prevent the default behavior

		const formData = new FormData(e.currentTarget);
		const values = Object.fromEntries(formData.entries());
		console.log(values);

		onFormSubmit();
	};

	useEffect(() => {
		if (data) {
			router.replace("/home");
		}
	}, [data, router]);

	return (
		<AuthLayoutWrapper page="signup">
			<main className="flex flex-col items-center self-center py-24 mt-12 max-w-full w-[448px] max-md:mt-10">
				<h1 className="text-3xl font-bold tracking-tighter leading-none text-center text-neutral-800">
					Sign up to FlareCast
				</h1>

				<form
					onSubmit={(e) => {
						handleSubmit(e);
					}}
					className="flex relative flex-wrap gap-3 items-center mt-10 w-full max-w-md text-sm tracking-normal leading-loose max-md:max-w-full"
				>
					{formFields.map((field, index) => (
						<div key={index} className="">
							<InputField
								key={field.id}
								id={field.id}
								label={field.label}
								type={field.type}
								defaultValue={field.id === "email" ? email || "" : ""}
								{...register(field.id)}
							/>
							{errors[field.id] && (
								<p className="text-red-600 text-sm mt-1">
									{errors[field.id]?.message as string}
								</p>
							)}
						</div>
					))}

					<Button
						type="submit"
						disabled={isPending}
						onClick={() => {
							// Navigate to login page
							// window.location.href = "/login";
						}}
					>
						Create Account
					</Button>

					{error && (
						<p className="mt-4 text-sm text-red-500">
							{error.message || "An error occurred. Please try again."}
						</p>
					)}

					<div className="flex z-0 grow shrink gap-2.5 items-start self-stretch pt-6 pr-24 pl-20 my-auto leading-6 min-w-[240px] w-[406px] max-md:px-5 max-md:max-w-full">
						<span className="text-neutral-800">Already have an account?</span>{" "}
						<Link href="/" className="text-indigo-500">
							Sign In
						</Link>
					</div>
				</form>
			</main>
		</AuthLayoutWrapper>
	);
};

export default SignUpForm;
