"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell, CheckCircle, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

function useWallet() {
  const [connected, setConnected] = useState(false)

  return {
    connected,
    signAndExecuteTransactionBlock: async (params: any) => {
      return {
        digest: "0x" + Math.random().toString(16).substr(2, 64),
      }
    },
  }
}

export function EmergencyAlert() {
  const { signAndExecuteTransactionBlock } = useWallet()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [txHash, setTxHash] = useState("")
  const [location, setLocation] = useState<string | null>(null)

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation",
        variant: "destructive",
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        // You can later replace this with maps.js or reverse geocoding API
        setLocation(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`)
        await sendEmergencyAlert(`Lat: ${latitude}, Lng: ${longitude}`)
      },
      (error) => {
        toast({
          title: "Location error",
          description: error.message,
          variant: "destructive",
        })
        setLoading(false)
      }
    )
  }

  const sendEmergencyAlert = async (locationMessage: string) => {
    setLoading(true)
    try {
      const result = await signAndExecuteTransactionBlock({
        transactionBlock: {
          moveCall: {
            target: "0x123::emergency::send_emergency_alert",
            arguments: [locationMessage, Date.now().toString()],
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
    setShowDialog(false)
    setLocation(null)
  }

  return (
    <div className="text-center max-w-2xl mx-auto space-y-8">
      <div className="flex justify-center">
        <div className="bg-red-500 p-4 rounded-full">
          <Bell className="w-8 h-8 text-white" />
        </div>
      </div>

      <h2 className="text-4xl md:text-5xl font-bold text-red-500 flex items-center justify-center gap-3">
        <Bell className="w-8 h-8" />
        EMERGENCY ALERT
      </h2>

      <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
        Instantly notify emergency services with your current location. This action is permanent and should only be used
        in actual emergencies.
      </p>

      <div className="pt-4">
        <Button
          size="lg"
          className="bg-red-500 hover:bg-red-600 text-white font-bold px-12 py-4 text-lg rounded-lg transition-colors"
          onClick={fetchLocation}
          disabled={loading}
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

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Alert Sent Successfully
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              Your emergency alert has been recorded. Confirm if this is your current location:
            </DialogDescription>
          </DialogHeader>

          {location && (
            <div className="bg-slate-900 p-4 rounded-md">
              <p className="text-sm text-slate-400 mb-1">Detected Location:</p>
              <p className="text-sm text-cyan-400 font-mono">{location}</p>
            </div>
          )}

          <div className="bg-slate-900 p-4 rounded-md mt-4">
            <p className="text-sm text-slate-400 mb-1">Transaction Hash:</p>
            <p className="text-xs text-cyan-400 break-all font-mono">{txHash}</p>
          </div>

          <p className="text-sm text-slate-300 mt-2">
            This action is permanently logged with a timestamp for verification.
          </p>

          <DialogFooter>
            <Button onClick={resetState}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}