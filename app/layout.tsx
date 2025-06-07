'use client';

import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { WalletProvider } from "@/components/wallet-provider"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  )
}
