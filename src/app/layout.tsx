import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/react-query";
import { UserStoreProvider } from "@/providers/UserStoreProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import CheckAuthentication from "@/components/auth/CheckAuthentication";
import { WorkspaceStoreProvider } from "@/providers/WorkspaceStoreProvider";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Create Next App",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<WorkspaceStoreProvider>
						<UserStoreProvider>
							<ReactQueryProvider>
								<CheckAuthentication>{children}</CheckAuthentication>
							</ReactQueryProvider>
						</UserStoreProvider>
					</WorkspaceStoreProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
