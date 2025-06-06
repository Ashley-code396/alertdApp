"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell, CheckCircle, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Mock wallet hook for demo purposes
function useWallet() {
  const [connected, setConnected] = useState(false)

  return {
    connected,
    signAndExecuteTransactionBlock: async (params: any) => {
      // Mock transaction execution
      return {
        digest: "0x" + Math.random().toString(16).substr(2, 64),
      }
    },
  }
}

export function EmergencyAlert() {
  const { connected, signAndExecuteTransactionBlock } = useWallet()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [message, setMessage] = useState("")
  const [showDialog, setShowDialog] = useState(false)
  const [txHash, setTxHash] = useState("")

  const sendEmergencyAlert = async () => {
    if (!message.trim()) return

    setLoading(true)
    try {
      // Simulate blockchain transaction
      const result = await signAndExecuteTransactionBlock({
        transactionBlock: {
          moveCall: {
            target: "0x123::emergency::send_emergency_alert",
            arguments: [message, Date.now().toString()],
          },
        },
      })

      setTxHash(result.digest)
      setSuccess(true)
      setShowDialog(true)

      toast({
        title: "Emergency alert sent",
        description: "Your alert has been recorded on the SUI blockchain",
      })
    } catch (error) {
      console.error("Failed to send emergency alert:", error)
      toast({
        title: "Failed to send alert",
        description: "There was an error sending your emergency alert",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetState = () => {
    setSuccess(false)
    setMessage("")
    setShowDialog(false)
  }

  return (
    <div className="text-center max-w-2xl mx-auto space-y-8">
      {/* Alert Icon */}
      <div className="flex justify-center">
        <div className="bg-red-500 p-4 rounded-full">
          <Bell className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Emergency Alert Heading */}
      <h2 className="text-4xl md:text-5xl font-bold text-red-500 flex items-center justify-center gap-3">
        <Bell className="w-8 h-8" />
        EMERGENCY ALERT
      </h2>

      {/* Description */}
      <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
        Send critical security alerts to all connected users in your SUI dApp network. Use responsibly for genuine
        emergencies only.
      </p>

      {/* Message Input */}
      <div className="pt-4">
        <Textarea
          placeholder="Describe the emergency situation..."
          className="bg-slate-800 border-slate-700 text-white"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
        />
      </div>

      {/* Send Alert Button */}
      <div className="pt-4">
        <Button
          size="lg"
          className="bg-red-500 hover:bg-red-600 text-white font-bold px-12 py-4 text-lg rounded-lg transition-colors"
          onClick={() => sendEmergencyAlert()}
          disabled={loading || !message.trim()}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              SENDING ALERT...
            </>
          ) : (
            "SEND EMERGENCY ALERT"
          )}
        </Button>
      </div>

      {/* Success Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Alert Sent Successfully
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              Your emergency alert has been recorded on the SUI blockchain and sent to service providers.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-slate-900 p-4 rounded-md">
            <p className="text-sm text-slate-400 mb-1">Transaction Hash:</p>
            <p className="text-xs text-cyan-400 break-all font-mono">{txHash}</p>
          </div>

          <p className="text-sm text-slate-300">
            This transaction is now permanently recorded on the blockchain with a timestamp for accountability.
          </p>

          <DialogFooter>
            <Button onClick={resetState}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
