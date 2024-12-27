"use client";
import React, { useState } from "react";
import { NewsletterFormProps } from "../../types";
import { Button } from "./Button";

export const NewsletterForm: React.FC<NewsletterFormProps> = ({ onSubmit }) => {
	const [email, setEmail] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(email);
		setEmail("");
	};

	return (
		<div>
			<p className="mt-3 text-xs text-black max-md:max-w-full mb-10">
				By subscribing, you consent to our Privacy Policy and receiving updates.
			</p>
			<form
				onSubmit={handleSubmit}
				className="flex flex-col w-full max-md:max-w-full"
			>
				<div className="flex flex-wrap gap-4 items-start w-full text-base max-md:max-w-full">
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Your Email Here"
						className="flex-1 shrink gap-2 self-stretch p-3 border border-black border-solid basis-6 min-w-[240px] text-stone-500"
						required
						aria-label="Email address"
					/>
					<Button type="submit" className="w-[119px]">
						Join
					</Button>
				</div>
				<p className="mt-3 text-xs text-black max-md:max-w-full">
					By subscribing, you consent to our Privacy Policy and receiving
					updates.
				</p>
			</form>
		</div>
	);
};
