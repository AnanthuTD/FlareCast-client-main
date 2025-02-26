"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
	Command,
	CommandInput,
	CommandList,
	CommandItem,
	CommandEmpty,
} from "@/components/ui/command";
import { searchVideo, suggestFolders, suggestVideo } from "@/actions/video";
import { useRouter } from "next/navigation";
import { Folder } from "lucide-react";

interface VideoSearchUIProps {
	workspaceId: string;
}

interface Video {
	title: string;
	description?: string;
	id: string;
	user: { id: string; name: string };
	createdAt: string;
	paginationToken: string;
}

interface Folder {
	name: string;
	id: string;
	paginationToken: string;
	createdAt: string;
	spaceId?: string;
}

interface SuggestedVideos {
	results: Video[];
	paginationToken: string;
}

interface SuggestedFolders {
	results: Folder[];
	paginationToken: string;
}

export function VideoSearchUI({ workspaceId }: VideoSearchUIProps) {
	const [inputValue, setInputValue] = useState("");
	const [suggestedVideos, setSuggestedVideos] = useState<SuggestedVideos>({
		paginationToken: "",
		results: [],
	});
	const [suggestedFolders, setSuggestedFolders] = useState<SuggestedFolders>({
		paginationToken: "",
		results: [],
	});
	const [searchResults, setSearchResults] = useState<Video[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [show, setShow] = useState(false);
	const router = useRouter();
	const isFetchingVideos = useRef(false);
	const isFetchingFolders = useRef(false);

	const fetchVideoSuggestions = async (value: string, token = "") => {
		if (isFetchingVideos.current) return;

		try {
			isFetchingVideos.current = true;
			const videoSuggestions = await suggestVideo({
				query: value,
				workspaceId,
				limit: 5,
				paginationToken: token,
			});
			setSuggestedVideos(videoSuggestions);
		} catch {
			setError("Failed to fetch video suggestions");
		} finally {
			isFetchingVideos.current = false;
		}
	};

	const fetchFolderSuggestions = async (value: string, token = "") => {
		if (isFetchingFolders.current) return;

		try {
			isFetchingFolders.current = true;
			const folderSuggestions = await suggestFolders({
				query: value,
				workspaceId,
				limit: 5,
				paginationToken: token,
			});
			setSuggestedFolders(folderSuggestions);
		} catch {
			setError("Failed to fetch folder suggestions");
		} finally {
			isFetchingFolders.current = false;
		}
	};

	const fetchSuggestions = useCallback(
		async (value: string) => {
			if (value.length < 2) {
				setSuggestedVideos({ paginationToken: "", results: [] });
				setSuggestedFolders({ paginationToken: "", results: [] });
				setError(null);
				return;
			}
			await Promise.all([
				fetchVideoSuggestions(value),
				fetchFolderSuggestions(value),
			]);
		},
		[workspaceId]
	);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (!isSearching && inputValue) {
				fetchSuggestions(inputValue);
			}
		}, 300);
		return () => clearTimeout(timer);
	}, [inputValue, isSearching, fetchSuggestions]);

	const loadMoreVideos = async () => {
		if (!suggestedVideos.paginationToken || isFetchingVideos.current) return;
		isFetchingVideos.current = true;
		try {
			const nextVideos = await suggestVideo({
				query: inputValue,
				workspaceId,
				limit: 5,
				paginationToken: suggestedVideos.paginationToken,
			});
			setSuggestedVideos({
				paginationToken: nextVideos.paginationToken,
				results: [...suggestedVideos.results, ...nextVideos.results],
			});
		} finally {
			isFetchingVideos.current = false;
		}
	};

	const loadMoreFolders = async () => {
		if (!suggestedFolders.paginationToken || isFetchingFolders.current) return;
		isFetchingFolders.current = true;
		try {
			const nextFolders = await suggestFolders({
				query: inputValue,
				workspaceId,
				limit: 5,
				paginationToken: suggestedFolders.paginationToken,
			});
			setSuggestedFolders({
				paginationToken: nextFolders.paginationToken,
				results: [...suggestedFolders.results, ...nextFolders.results],
			});
		} finally {
			isFetchingFolders.current = false;
		}
	};

	const handleSearch = (value: string) => {
		setInputValue(value);
		setSearchResults([]);
		setShow(true);
	};

	const performFullSearch = async () => {
		if (inputValue.length < 2) return;
		setIsSearching(true);
		setError(null);
		try {
			const results = await searchVideo({
				query: inputValue,
				workspaceId,
				limit: 10,
			});
			setSearchResults(Array.isArray(results) ? results : []);
			setSuggestedVideos({ paginationToken: "", results: [] });
			setSuggestedFolders({ paginationToken: "", results: [] });
		} catch {
			setError("Failed to load search results");
			setSearchResults([]);
		} finally {
			setIsSearching(false);
		}
	};

	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const target = e.currentTarget;
		const atBottom =
			target.scrollHeight - target.scrollTop - target.clientHeight < 50;
		if (atBottom) {
			Promise.all([loadMoreVideos(), loadMoreFolders()]).finally(() => {
			});
		}
	};

	return (
		<div className="relative w-full px-3 py-1.5 text-sm bg-white text-neutral-800">
			<Command className="rounded-lg border shadow-md z-50 h-fit">
				<CommandInput
					placeholder="Search videos..."
					value={inputValue}
					onValueChange={handleSearch}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !isSearching) performFullSearch();
					}}
					disabled={isSearching}
					className="w-full"
					onFocus={() => setShow(true)}
					onBlur={() => setTimeout(() => setShow(false), 100)}
				/>
				<CommandList
					className={`left-0 right-0 top-full overflow-y-auto rounded-lg border bg-white h-[50vh] shadow-md ${
						show ? "" : "hidden"
					}`}
					onScroll={handleScroll}
				>
					{isSearching && (
						<CommandItem disabled className="flex items-center gap-2 py-2 px-2">
							<svg
								className="animate-spin h-4 w-4 text-gray-500"
								viewBox="0 0 24 24"
							>
								<circle
									cx="12"
									cy="12"
									r="10"
									className="opacity-25"
									fill="none"
									stroke="currentColor"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
								/>
							</svg>
							Searching...
						</CommandItem>
					)}
					{!isSearching && error && (
						<CommandEmpty className="py-2 text-red-500 px-2">
							{error}
						</CommandEmpty>
					)}
					{suggestedVideos.results.map((suggestion) => (
						<CommandItem
							key={suggestion.id} // Use id for uniqueness
							onSelect={() => router.push(`/video/${suggestion.id}`)}
							className="cursor-pointer hover:bg-gray-100 py-1.5 px-2"
							value={suggestion.title}
						>
							<span className="flex gap-2">
								<div>
									<p>{suggestion.title}</p>
									<span>{suggestion.user.name}</span> ·{" "}
									<span>{new Date(suggestion.createdAt).toDateString()}</span>
								</div>
							</span>
						</CommandItem>
					))}
					{suggestedFolders.results.map((folder) => (
						<CommandItem
							key={folder.id} // Use id for uniqueness
							onSelect={() =>
								router.push(
									folder.spaceId
										? `/space/${folder.spaceId}/folder/${folder.id}`
										: `/library/folder/${folder.id}`
								)
							}
							className="cursor-pointer hover:bg-gray-100 py-1.5 px-2"
							value={folder.name}
						>
							<span className="flex gap-2">
								<Folder />
								<div>
									<p>{folder.name}</p>
									<span>{new Date(folder.createdAt).toDateString()}</span>
								</div>
							</span>
						</CommandItem>
					))}
					{!isSearching &&
						inputValue.length >= 2 &&
						suggestedVideos.results.length === 0 &&
						suggestedFolders.results.length === 0 &&
						searchResults.length === 0 &&
						!error && (
							<CommandEmpty className="px-2">
								No videos or folders found.
							</CommandEmpty>
						)}
				</CommandList>
			</Command>
		</div>
	);
}
