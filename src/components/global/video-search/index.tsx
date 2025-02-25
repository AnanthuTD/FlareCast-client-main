"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
	Command,
	CommandInput,
	CommandList,
	CommandItem,
	CommandEmpty,
} from "@/components/ui/command";
import { searchVideo, suggestVideo } from "@/actions/video";
import { useRouter } from "next/navigation";

interface VideoSearchUIProps {
	workspaceId: string;
}

interface Video {
	title: string;
	description?: string;
	id: string;
	user: {
		id: string;
		name: string;
	};
	createdAt: string;
}

export function VideoSearchUI({ workspaceId }: VideoSearchUIProps) {
	const [inputValue, setInputValue] = useState("");
	const [suggestions, setSuggestions] = useState<Video[]>([]);
	const [searchResults, setSearchResults] = useState<Video[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [show, setShow] = useState(false);
  const router = useRouter()

	const fetchSuggestions = useCallback(
		async (value: string) => {
			if (value.length < 2) {
				setSuggestions([]);
				return;
			}

			try {
				const results = await suggestVideo({
					query: value,
					workspaceId,
					limit: 5,
				});
				console.log("Suggestions results:", results, Array.isArray(results));
				setSuggestions(Array.isArray(results) ? results : []);
				setError(null);
			} catch (err) {
				console.error(err);
				setError("Failed to load suggestions");
				setSuggestions([]);
			}
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

	const handleSearch = (value: string) => {
		setInputValue(value);
		setSearchResults([]);
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
			console.log("Search results:", results, Array.isArray(results));
			setSearchResults(Array.isArray(results) ? results : []);
			setSuggestions([]);
		} catch (err) {
			console.error(err);
			setError("Failed to load search results");
			setSearchResults([]);
		} finally {
			setIsSearching(false);
		}
	};

	return (
		<>
			<div className="relative w-full flex flex-auto gap-2 px-3 py-1.5 text-sm leading-relaxed bg-white text-neutral-800"
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}>
				<Command className="rounded-lg border shadow-md z-50 h-fit absolute grow">
					<CommandInput
						placeholder="Search videos..."
						value={inputValue}
						onValueChange={handleSearch}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !isSearching) {
								performFullSearch();
							}
						}}
						disabled={isSearching}
						className="w-full"
						
					/>

					<CommandList
						className={` 
            left-0 
            right-0 
            top-full 
            overflow-y-visible 
            rounded-lg 
            border 
            bg-white 
            h-[50vh]
            shadow-md ${show ? "" : "hidden"}
            `}
					>
						{isSearching && (
							<CommandItem
								disabled
								className="flex items-center gap-2 py-2 px-2 z-20"
							>
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

						{Array.isArray(suggestions) &&
							suggestions.length > 0 &&
							suggestions.map((suggestion) => (
								<CommandItem
									key={suggestion.title}
									onSelect={() => {
										setInputValue(suggestion.title);
										// performFullSearch();
                    router.push(`/video/${suggestion.id}`);
									}}
									className="cursor-pointer hover:bg-gray-100 py-1.5 px-2"
									value={suggestion.title}
								>
										<p>{suggestion.title}</p>
										<span>{suggestion.user.name}</span> .{" "}
										<span>{new Date(suggestion.createdAt).toDateString()}</span>
								</CommandItem>
							))}

						{!isSearching &&
							inputValue.length >= 2 &&
							(!Array.isArray(suggestions) || suggestions.length === 0) &&
							(!Array.isArray(searchResults) || searchResults.length === 0) &&
							!error && (
								<CommandEmpty className="px-2">No videos found.</CommandEmpty>
							)}
					</CommandList>
				</Command>
			</div>
		</>
	);
}
