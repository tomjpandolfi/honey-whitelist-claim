import { BN, Program, Provider, utils } from '@project-serum/anchor';
import { ReadonlyProvider } from '@saberhq/solana-contrib';
import {
  BalanceTree,
  toBytes32Array,
} from '@saberhq/merkle-distributor/dist/esm/utils';
import {
  createATAInstruction,
  getATAAddress,
  TOKEN_PROGRAM_ID,
  u64,
} from '@saberhq/token-utils';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

import wlList from '../../wlList.json';
import { WalletAdapter } from '@saberhq/use-solana';
import { MerkleDistributorJSON } from './idl';

global.Buffer = global.Buffer || require('buffer').Buffer;

const MINT = new PublicKey('4ri4xMbRDFwx3sxQ4JqUGcxTw8VXwwkTnkL3KESzuYvY');
const DISTRIBUTOR_PDA = new PublicKey(
  'ApjM9pLecbC1HoTifRN8TpD1PMnQCr3iuMbEb8eSN4a5'
);
const SOURCE_ATA = new PublicKey(
  'AbtYw5ruJMifCiXBdd476J2fxJ6ABpDs6k13jWZ7PraD'
);
const PROGRAM_ID = new PublicKey('MRKGLMizK9XSTaD1d1jbVkdHZbQVCSnPpYiTw9aKQv8');

export const findClaimStatusKey = async (
  index: u64,
  distributor: PublicKey
): Promise<[PublicKey, number]> => {
  return await PublicKey.findProgramAddress(
    [
      utils.bytes.utf8.encode('ClaimStatus'),
      index.toArrayLike(Buffer, 'le', 8),
      distributor.toBytes(),
    ],
    PROGRAM_ID
  );
};

export const claimTokens = async (
  provider: ReadonlyProvider,
  wallet: WalletAdapter<boolean>,
  account: PublicKey,
  amount: BN,
  index: u64
) => {
  try {
    const tree = new BalanceTree(
      wlList.map(({ account, amount }) => ({
        account: new PublicKey(account),
        amount: new u64(amount),
      }))
    );

    const anchorProvider = new Provider(
      provider.connection,
      provider.wallet,
      provider.opts
    );

    const { instruction } = new Program(
      MerkleDistributorJSON,
      PROGRAM_ID,
      anchorProvider
    );

    const proof = tree.getProof(index.toNumber(), account, amount);
    const [claimStatus, bump] = await findClaimStatusKey(
      index,
      DISTRIBUTOR_PDA
    );

    const ataAddress = await getATAAddress({
      mint: MINT,
      owner: wallet.publicKey!,
    });

    const claimIx = instruction.claim(
      bump,
      index,
      amount,
      proof.map((p) => toBytes32Array(p)),
      {
        accounts: {
          distributor: DISTRIBUTOR_PDA,
          claimStatus,
          from: SOURCE_ATA,
          to: ataAddress,
          claimant: wallet.publicKey!,
          payer: wallet.publicKey!,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
      }
    );

    const tx = new Transaction();

    if (!(await provider.connection.getAccountInfo(ataAddress))) {
      tx.add(
        createATAInstruction({
          address: ataAddress,
          mint: MINT,
          owner: wallet.publicKey!,
          payer: wallet.publicKey!,
        })
      );
    }

    tx.add(claimIx);
    tx.recentBlockhash = (
      await provider.connection.getRecentBlockhash()
    ).blockhash;
    tx.feePayer = wallet.publicKey!;

    const signedTx = await wallet.signTransaction(tx);

    const txHash = await provider.connection.sendRawTransaction(
      signedTx.serialize()
    );
    await provider.connection.confirmTransaction(txHash);
  } catch (err) {
    throw err;
  }
};
