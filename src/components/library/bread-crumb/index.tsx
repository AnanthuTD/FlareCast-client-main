import React, { useEffect, useState } from 'react'
import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { fetchParentFolders } from '@/actions/folder'
import { useWorkspaceStore } from '@/providers/WorkspaceStoreProvider'
import { Folder } from '@/types'
import Link from 'next/link'

function FolderPredecessors({ folderId }: { folderId?: string }) {
    const [parentFolders, setParentFolders] = useState<Folder[]>([]);
    const activeWorkspaceId = useWorkspaceStore(state => state.selectedWorkspace.id);
    const [currentFolder, setCurrentFolder] = useState<null | Folder>(null);

    useEffect(() => {
        if (activeWorkspaceId && folderId && typeof folderId === 'string') {
            // Fetch the parent folders based on the current folderId
            fetchParentFolders(activeWorkspaceId, folderId)
                .then(folders => {
                    const { parentFolders, ...curr } = folders;
                    setParentFolders(parentFolders);
                    setCurrentFolder(curr);
                })
                .catch(error => {
                    console.error('Error fetching parent folders:', error);
                });
        }
    }, [folderId, activeWorkspaceId]); // Trigger this effect whenever folderId changes

    // Constants for handling overflow in breadcrumbs
    const MAX_VISIBLE_FOLDERS = 3; // Number of folders to show before collapsing into a dropdown
    const overflowFolders = parentFolders.length > MAX_VISIBLE_FOLDERS ? parentFolders.slice(0, -MAX_VISIBLE_FOLDERS) : [];
    const visibleFolders = parentFolders.length > MAX_VISIBLE_FOLDERS ? parentFolders.slice(-MAX_VISIBLE_FOLDERS) : parentFolders;

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {/* Home link */}
                <BreadcrumbItem>
                    <Link href="/library">Home</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />

                {/* Overflow Folders */}
                {overflowFolders.length > 0 && (
                    <BreadcrumbItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <BreadcrumbEllipsis>...</BreadcrumbEllipsis>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {overflowFolders.map(folder => (
                                    <DropdownMenuItem key={folder.id}>
                                        <Link href={`/library/folder/${folder.id}`}>{folder.name}</Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <BreadcrumbSeparator />
                    </BreadcrumbItem>
                )}

                {/* Visible Parent Folders */}
                {visibleFolders.map((folder, index) => (
                    <React.Fragment key={folder.id}>
                        <BreadcrumbItem>
                            <Link href={`/library/folder/${folder.id}`}>{folder.name}</Link>
                        </BreadcrumbItem>
                        {index < visibleFolders.length - 1 && <BreadcrumbSeparator />} {/* Avoid separator at the last item */}
                    </React.Fragment>
                ))}

                {/* Current Folder */}
                {currentFolder && (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{currentFolder.name}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
}

export default FolderPredecessors;
