"use client"

import type { ReactNode } from "react"

// Simple wallet context for demo purposes
export function WalletProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}
