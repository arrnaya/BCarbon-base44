import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import { WalletProvider } from "@/context/walletcontext"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThirdwebProvider } from "thirdweb/react";

function App() {
  return (
    <>
      <ThirdwebProvider >
        <TooltipProvider>
          <WalletProvider>
            <Pages />
            <Toaster />
          </WalletProvider>
        </TooltipProvider>
      </ThirdwebProvider>

    </>
  )
}


export default App 