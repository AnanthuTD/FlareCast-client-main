'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { createWorkspaceStore, WorkspaceStore } from '@/stores/useWorkspaces'
import { useStore } from 'zustand'

export type WorkspaceStoreApi = ReturnType<typeof createWorkspaceStore>

export const UserStoreContext = createContext<WorkspaceStoreApi | undefined>(
  undefined,
)

export interface WorkspaceStoreProviderProps {
  children: ReactNode
}

export const WorkspaceStoreProvider = ({
  children,
}: WorkspaceStoreProviderProps) => {
  const storeRef = useRef<WorkspaceStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createWorkspaceStore()
  }

  return (
    <UserStoreContext.Provider value={storeRef.current}>
      {children}
    </UserStoreContext.Provider>
  )
}

export const useUserStore = <T,>(
  selector: (store: WorkspaceStore) => T,
): T => {
  const workspaceStoreContext = useContext(UserStoreContext)

  if (!workspaceStoreContext) {
    throw new Error(`workspaceStore must be used within CounterStoreProvider`)
  }

  return useStore(workspaceStoreContext, selector)
}
