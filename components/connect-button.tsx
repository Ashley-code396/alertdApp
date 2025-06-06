"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

export function ConnectButton() {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [address] = useState("0x1234...5678") // Mock address for demo

  const handleConnect = async () => {
    if (connected) {
      setConnected(false)
    } else {
      setConnecting(true)
      // Simulate connection delay
      setTimeout(() => {
        setConnected(true)
        setConnecting(false)
      }, 1000)
    }
  }

  return (
    <Button
      onClick={handleConnect}
      className={`${
        connected ? "bg-slate-700 hover:bg-slate-600" : "bg-cyan-400 hover:bg-cyan-500 text-slate-900"
      } font-semibold px-6 py-2 rounded-lg flex items-center gap-2`}
      disabled={connecting}
    >
      <Wallet className="h-4 w-4" />
      {connecting ? "Connecting..." : connected ? address : "Connect Wallet"}
    </Button>
  )
}
