import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 w-full">
        {/* Left Column (Video Player and Actions) */}
        <div className="flex flex-col lg:col-span-2 gap-y-6">
          {/* Video Player Skeleton */}
          <div className="bg-background rounded-lg p-4 border">
            <div className="flex justify-between items-center mb-2">
              <Skeleton className="h-8 w-1/2" /> {/* Title */}
              <Skeleton className="h-6 w-6 rounded-full" /> {/* Edit Button */}
            </div>
            <Skeleton className="h-6 w-1/4 mb-4" /> {/* Days Ago */}
            <Skeleton className="h-64 w-full" /> {/* Player Placeholder */}
          </div>
          {/* Actions Skeleton */}
          <div className="bg-background rounded-lg p-4 border flex justify-end gap-4">
            <Skeleton className="h-6 w-16" /> {/* Trim */}
            <Skeleton className="h-6 w-16" /> {/* Copy */}
            <Skeleton className="h-6 w-16" /> {/* Rich Link */}
            <Skeleton className="h-6 w-6" /> {/* Download */}
            <Skeleton className="h-6 w-6" /> {/* Bookmark */}
          </div>
          {/* Description Skeleton */}
          <div className="bg-background rounded-lg p-4 border">
            <div className="flex justify-between items-center mb-2">
              <Skeleton className="h-6 w-1/3" /> {/* Description Label */}
              <Skeleton className="h-6 w-6 rounded-full" /> {/* Edit Button */}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
        {/* Right Column (TabMenu) */}
        <div className="lg:col-span-1">
          <div className="bg-background rounded-lg p-4 border">
            <Skeleton className="h-10 w-full mb-4" /> {/* Tab Headers */}
            <Skeleton className="h-48 w-full" /> {/* Tab Content */}
          </div>
        </div>
      </div>
    </div>
  );
}