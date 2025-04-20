import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/app/ReactQueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import CheckAuthentication from "@/components/auth/CheckAuthentication";
import { UserStoreProvider } from "@/providers/UserStoreProvider";
import { Suspense } from "react";
import { Toaster } from "sonner";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "FlareCast",
	description: "Video Communication & Collaboration Platform",
	icons: "/flare-cast-icon.svg",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen`}
			>
				{/* <AntdRegistry> */}
					<ThemeProvider
						attribute="class"
						defaultTheme="light"
						enableSystem
						disableTransitionOnChange
					>
						<Toaster position="top-right" richColors />
						<UserStoreProvider>
							<ReactQueryProvider>
								<Suspense>
									<CheckAuthentication>{children}</CheckAuthentication>
								</Suspense>
							</ReactQueryProvider>
						</UserStoreProvider>
					</ThemeProvider>
				{/* </AntdRegistry> */}
			</body>
		</html>
	);
}
