import { useContext, useState } from "react"
import Countdown from "react-countdown"
import { Text } from "degen"
import Button from "../../components/Button"
import ModalContainer from "../../components/ModalContainer/ModalContainer"
import TitleText from "../../components/TitleText"
import { WalletContext } from "../../context/wallet"
import walletOptions from "../../helpers/connectWallet"
import "./ClaimPage.scss"

const renderLaunchCountdown = (props: {
  hours: any
  minutes: any
  seconds: any
  days: any
}) => {
  console.log()
  return (
    <div className="launch-countdown">
      <div>
        <Text>
          {props.hours} hours {props.minutes} mins {props.seconds} secs
        </Text>
      </div>
    </div>
  )
}

const ClaimPage = () => {
  const { connectWallet, walletAddress } = useContext(WalletContext)
  const [isWalletSelectVisible, setIsWalletSelectVisible] = useState<boolean>()
  const hasAppOpened = new Date().valueOf() > 1644283443002
  const claimToken = () => {}

  return (
    <div className="connect-wallet-page">
      {!walletAddress && (
        <ModalContainer
          className="wallet-options-modal"
          isVisible={isWalletSelectVisible}
          onClose={() => setIsWalletSelectVisible(false)}
        >
          <div className="wallet-options-container">
            <TitleText>Connect wallet</TitleText>
            <div className="line" />
            {walletOptions.map(({ name, connect, icon }) => (
              <div
                key={name}
                onClick={() => {
                  connectWallet(name, connect)
                }}
                className="wallet-option"
              >
                <Text>{name}</Text>
                <img src={icon} alt={`${name} icon`} />
              </div>
            ))}
          </div>
        </ModalContainer>
      )}

      <TitleText>Honey Finance Whitelist Token Claim</TitleText>
      <Text>
        Complete this quiz to verify your knowledge of the Honey protocol and
        attempt to earn a whitelist spot for our upcoming mint
      </Text>
      {!hasAppOpened ? (
        <div className="countdown">
          <Text>Opens in </Text>
          <Countdown
            date={new Date(1644283443002)}
            renderer={renderLaunchCountdown}
          />
        </div>
      ) : (
        <Button
          secondary={walletAddress ? false : true}
          title={walletAddress ? "Claim token" : "Connect wallet"}
          onClick={
            walletAddress ? claimToken : () => setIsWalletSelectVisible(true)
          }
          className="connect-wallet-button"
        />
      )}
    </div>
  )
}

export default ClaimPage
