import { BN } from '@project-serum/anchor';
import { ReadonlyProvider, SolanaProvider } from '@saberhq/solana-contrib';
import { MerkleDistributorSDK } from '@saberhq/merkle-distributor';
import { BalanceTree } from '@saberhq/merkle-distributor/dist/esm/utils';
import { u64 } from '@saberhq/token-utils';
import { PublicKey, Transaction } from '@solana/web3.js';

import wlList from '../../wlList.json';

global.Buffer = global.Buffer || require('buffer').Buffer;

export const makeSDK = (provider: ReadonlyProvider): MerkleDistributorSDK => {
  const connectionProvider = SolanaProvider.init({
    connection: provider.connection,
    wallet: provider.wallet,
    opts: provider.opts,
  });

  return MerkleDistributorSDK.load({ provider: connectionProvider });
};

export const claimTokens = async (
  provider: ReadonlyProvider,
  account: PublicKey,
  amount: BN,
  index: u64
) => {
  const sdk = makeSDK(provider);
  const tree = new BalanceTree(
    wlList.map(({ account, amount }) => ({
      account: new PublicKey(account),
      amount: new u64(amount),
    }))
  );

  const distributorW = await sdk.loadDistributor(
    new PublicKey('EmQWCPudPzdovrjNidi2gfdRLdowDBr7hwXi2HS4NDvk')
  );
  const proof = tree.getProof(index.toNumber(), account, amount);

  const { instructions } = await distributorW.claim({
    index,
    amount,
    proof,
    claimant: account,
  });

  console.log(instructions);

  const tx = new Transaction().add(...instructions);
  tx.recentBlockhash = (
    await provider.connection.getRecentBlockhash()
  ).blockhash;
  tx.feePayer = provider.wallet.publicKey;

  const signedTx = await sdk.provider.wallet.signTransaction(tx);
  console.log(signedTx);
  // const txHash = await provider.connection.sendRawTransaction(
  //   signedTx.serialize()
  // );
  // await provider.connection.confirmTransaction(txHash);
};
