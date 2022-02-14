import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import WalletProvider from "./context/wallet"
import { ThemeProvider } from "degen"
import "degen/styles"

ReactDOM.render(
  <WalletProvider>
    <ThemeProvider forcedMode="dark">
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ThemeProvider>
  </WalletProvider>,
  document.getElementById("root")
)
