import * as React from "react";
import { WorkspaceProps } from "@/types";

export const Workspace: React.FC<WorkspaceProps> = ({
  name,
  memberCount,
  avatarLabel
}) => {
  return (
    <div className="flex gap-2 items-center pr-5 mt-6">
      <div className="self-stretch px-2 my-auto w-6 h-6 text-sm leading-relaxed text-orange-800 whitespace-nowrap bg-red-200 rounded-md">
        {avatarLabel}
      </div>
      <div className="overflow-hidden self-stretch py-1.5 my-auto text-sm leading-loose text-gray-500 ">
        {name}
      </div>
    </div>
  );
};