import { EmergencyAlert } from "@/components/emergency-alert"
import { ConnectButton } from "@/components/connect-button"

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <h1 className="text-2xl font-bold text-cyan-400">Emergency</h1>
        <ConnectButton />
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6">
        <EmergencyAlert />
      </main>
    </div>
  )
}
