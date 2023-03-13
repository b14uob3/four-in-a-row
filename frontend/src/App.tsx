import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import React, { FC, ReactNode, useState, useMemo } from 'react';

import Status from './components/Status';
import Board, { TBoard } from './components/Board';
import Init from './components/Init';

const ROW = 6;
const COL = 7;

const App: FC = () => {
    const [board, setBoard] = useState<TBoard>(Array(ROW).fill(Array(COL).fill(null)));
    const [boardId, setBoardId] = useState<string | null>(null);
    const [status, setStatus] = useState<string>("hi :)");
    const [address, setAddress] = useState<string | null>(null);

    return (
        <Context>
            <Connect />
            <Status status={status} />
            <Board board={board} />
            <Init boardId={boardId} setBoardId={setBoardId} />
        </Context>
    );
};

const Context: FC<{ children: ReactNode }> = ({ children }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

const Connect: FC = () => {
    return (
        <div className="absolute top-4 right-4">
            <WalletMultiButton className="h-9 rounded-md border border-gray-300 bg-white py-1.5 px-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"/>
        </div>
    );
};

export default App;