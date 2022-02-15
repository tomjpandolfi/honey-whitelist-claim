import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { WalletKitProvider } from '@gokiprotocol/walletkit';
import { ThemeProvider } from 'degen';
import 'degen/styles';

ReactDOM.render(
  <ThemeProvider forcedMode='dark'>
    <WalletKitProvider
      defaultNetwork='mainnet-beta'
      app={{
        name: 'Honey Whitelist Claim',
        icon: (
          <img
            src='https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/honey-pot_1f36f.png'
            alt='honey'
          />
        ),
      }}
    >
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </WalletKitProvider>
  </ThemeProvider>,
  document.getElementById('root')
);
