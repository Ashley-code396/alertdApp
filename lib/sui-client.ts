import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client"

// Initialize the SUI client with the appropriate network
export const suiClient = new SuiClient({
  url: getFullnodeUrl("testnet"), // Change to mainnet when ready for production
})
