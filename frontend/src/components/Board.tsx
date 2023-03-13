import React from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, Idl, Wallet } from "@project-serum/anchor";
import idl from "../idl.json";
import { useWallet } from "@solana/wallet-adapter-react";

const Board = ({board, boardId, status}: {board: (string | null)[][], boardId: string | null, status: string}) => {
    const wallet = useWallet();
    const connection = new Connection("https://api.devnet.solana.com", "processed");
    const programId = new PublicKey("8M4pLE5ir2ec6uf1bw5ydMyhgb6PZTxw1jyx8tHV5iat");
    const provider = new AnchorProvider(connection, (wallet as unknown) as Wallet, { preflightCommitment: "processed" });
    const program = new Program(idl as Idl, programId, provider);

    const handleClick = async (col: number) => {
        if (boardId === null) return;
        if (status !== "Your turn!") return;
    
        const tx = await program.methods
            .addChecker(col)
            .accounts({
                signer: wallet.publicKey!,
                board: new PublicKey(boardId),
            })
            .transaction();
        
        const latestBlockhash = await connection.getLatestBlockhash();
        tx.recentBlockhash = latestBlockhash.blockhash;
        tx.feePayer = wallet.publicKey!;

        const signedTx = await wallet.signTransaction!(tx);
        const txid = await connection.sendRawTransaction(signedTx.serialize());
    }


    const renderColumn = (col: number) => {
        return (
            <div 
                className="bg-blue-300 h-auto w-auto inline-block"
                onClick={() => handleClick(col)}
                key={col}
            >
                {board.map((row, i) =>
                    <div
                        className="h-7 w-7 rounded-full border-blue-300 border-4"
                        style={
                            row[col] === "red" ? { backgroundColor: "#d22a2a" } :
                                row[col] === "yellow" ? { backgroundColor: "#ffc515" } :
                                    { backgroundColor: "white" }
                        }                        
                        key={i}
                    >
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center bg-orange-500" style={{height: "70%"}}>
            <div className="bg-blue-900 w-auto h-44 border-4 border-blue-900">
                {board[0].map((_, i) => renderColumn(i))}
            </div>
        </div>
    );

};

export default Board;