import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { WalletKitProvider } from '@gokiprotocol/walletkit';
import { ThemeProvider } from 'degen';
import 'degen/styles';

ReactDOM.render(
  <WalletKitProvider
    defaultNetwork='mainnet-beta'
    app={{
      name: 'Honey Whitelist Claim',
      // icon: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/honey-pot_1f36f.png',
    }}
  >
    <ThemeProvider forcedMode='dark'>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ThemeProvider>
  </WalletKitProvider>,
  document.getElementById('root')
);
