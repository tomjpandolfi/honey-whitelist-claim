import Countdown from 'react-countdown';
import { Text } from 'degen';
import Button from '../../components/Button';
import TitleText from '../../components/TitleText';
import './ClaimPage.scss';
import { claimTokens } from './claim';

import wlList from '../../wlList.json';
import BN from 'bn.js';
import { u64 } from '@saberhq/token-utils';
import { useSolana } from '@saberhq/use-solana';
import { useWalletKit } from '@gokiprotocol/walletkit';

const renderLaunchCountdown = (props: {
  hours: any;
  minutes: any;
  seconds: any;
  days: any;
}) => {
  console.log();
  return (
    <div className='launch-countdown'>
      <div>
        <Text>
          {props.hours} hours {props.minutes} mins {props.seconds} secs
        </Text>
      </div>
    </div>
  );
};

const ClaimPage = () => {
  const { wallet, provider, connected } = useSolana();
  const { connect } = useWalletKit();
  const hasAppOpened = new Date().valueOf() > 1644283443002;

  const handleClaim = async () => {
    try {
      if (wallet?.publicKey) {
        const entryIndex = wlList.findIndex(
          (e) => e.account.toString() === wallet.publicKey?.toString()
        );

        if (entryIndex === -1) {
          alert(
            'Invalid address. Please connect with a different wallet and try again.'
          );
          return;
        }

        const entry = wlList.find(
          (e) => e.account.toString() === wallet.publicKey?.toString()
        )!;

        await claimTokens(
          provider,
          wallet,
          wallet.publicKey,
          new BN(entry.amount),
          new u64(entry.index)
        );

        alert(`Successfully claimed ${entry.amount} tokens`);
      }
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className='connect-wallet-page'>
      <TitleText>Honey Finance Whitelist Token Claim</TitleText>
      {!hasAppOpened ? (
        <div className='countdown'>
          <Text>Opens in </Text>
          <Countdown
            date={new Date(1644283443002)}
            renderer={renderLaunchCountdown}
          />
        </div>
      ) : (
        <Button
          secondary={wallet && connected ? false : true}
          title={
            wallet
              ? 'Claim token'
              : connected
              ? 'Connecting...'
              : 'Connect wallet'
          }
          onClick={wallet ? handleClaim : connect}
          className='connect-wallet-button'
        />
      )}
      <Text>
        Already claimed? Mint{' '}
        <a
          href='https://honey-mint.vercel.app'
          target='_blank'
          rel='noopener noreferrer'
          style={{ color: '#FF4539' }}
        >
          here
        </a>
      </Text>
    </div>
  );
};

export default ClaimPage;
