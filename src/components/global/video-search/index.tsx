"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandSeparator,
  CommandGroup,
} from "@/components/ui/command";
import { searchVideo, suggestFolders, suggestVideo } from "@/actions/video";
import { useRouter } from "next/navigation";
import { Folder, Video } from "lucide-react";

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
  const commandRef = useRef<HTMLDivElement>(null); // Ref to track Command component

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
      await Promise.all([fetchVideoSuggestions(value), fetchFolderSuggestions(value)]);
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
    const atBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 50;
    if (atBottom) {
      Promise.all([loadMoreVideos(), loadMoreFolders()]);
    }
  };

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto px-4 py-2 bg-white rounded-lg shadow-md">
      <Command ref={commandRef} className="rounded-lg border border-gray-200 shadow-sm">
        <CommandInput
          placeholder="Search videos or folders..."
          value={inputValue}
          onValueChange={handleSearch}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isSearching) performFullSearch();
          }}
          disabled={isSearching}
          className="w-full text-base text-gray-800 placeholder-gray-400 border-none focus:ring-0"
          onFocus={() => setShow(true)}
        />
        <CommandList
          className={`overflow-y-auto rounded-b-lg border-t border-gray-200 bg-white max-h-[50vh] transition-all duration-200 ease-in-out ${
            show ? "opacity-100" : "opacity-0 h-0"
          }`}
          onScroll={handleScroll}
          style={{ display: show ? "block" : "none" }}
        >
          {isSearching && (
            <CommandItem
              disabled
              className="flex items-center gap-3 px-4 py-2 text-gray-500"
            >
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
          {error && (
            <CommandEmpty className="py-2 px-4 text-red-500 font-medium">
              {error}
            </CommandEmpty>
          )}
          {suggestedVideos.results.length > 0 && (
            <CommandGroup heading="Videos">
              {suggestedVideos.results.map((suggestion) => (
                <React.Fragment key={suggestion.id}>
                  <CommandItem
                    onSelect={() => router.push(`/video/${suggestion.id}`)}
                    className="cursor-pointer hover:bg-gray-100 px-4 py-2 text-gray-800 transition-colors duration-150"
                    value={suggestion.title}
                  >
                    <div className="flex items-center gap-3">
                      <Video className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-sm">{suggestion.title}</p>
                        <span className="text-xs text-gray-500">
                          {suggestion.user.name} ·{" "}
                          {new Date(suggestion.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CommandItem>
                  <CommandSeparator className="border-gray-100" />
                </React.Fragment>
              ))}
            </CommandGroup>
          )}
          {suggestedFolders.results.length > 0 && (
            <CommandGroup heading="Folders">
              {suggestedFolders.results.map((folder) => (
                <React.Fragment key={folder.id}>
                  <CommandItem
                    onSelect={() =>
                      router.push(
                        folder.spaceId
                          ? `/space/${folder.spaceId}/folder/${folder.id}`
                          : `/library/folder/${folder.id}`
                      )
                    }
                    className="cursor-pointer hover:bg-gray-100 px-4 py-2 text-gray-800 transition-colors duration-150"
                    value={folder.name}
                  >
                    <div className="flex items-center gap-3">
                      <Folder className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="font-medium text-sm">{folder.name}</p>
                        <span className="text-xs text-gray-500">
                          {new Date(folder.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CommandItem>
                  <CommandSeparator className="border-gray-100" />
                </React.Fragment>
              ))}
            </CommandGroup>
          )}
          {!isSearching &&
            inputValue.length >= 2 &&
            suggestedVideos.results.length === 0 &&
            suggestedFolders.results.length === 0 &&
            searchResults.length === 0 &&
            !error && (
              <CommandEmpty className="px-4 py-2 text-gray-500">
                No videos or folders found.
              </CommandEmpty>
            )}
        </CommandList>
      </Command>
    </div>
  );
}