// 'use client'
import React from "react";

const EmailVerificationPage = () => {
	return (
		<div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
			<div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
				{/* Icon */}
				<div className="mb-6">
					<svg
						className="w-16 h-16 mx-auto text-blue-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
						></path>
					</svg>
				</div>

				{/* Heading */}
				<h1 className="text-2xl font-bold text-gray-800 mb-4">
					Verify Your Email Address
				</h1>

				{/* Message */}
				<p className="text-gray-600 mb-6">
					We&apos;ve sent a verification email to your inbox. Please check your email
					and click the link to verify your account before logging in.
				</p>

				{/* Resend Email Button */}
				{/* <button
					className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
					onClick={() => alert("Resend email functionality goes here.")}
				>
					Resend Verification Email
				</button> */}

				{/* Back to Login Link */}
				<p className="mt-6 text-gray-600">
					Already verified?{" "}
					<a href="/signin" className="text-blue-500 hover:underline">
						Log in here
					</a>
				</p>
			</div>
		</div>
	);
};

export default EmailVerificationPage;
