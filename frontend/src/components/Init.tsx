import { useWallet } from "@solana/wallet-adapter-react";
import React, { useRef, useState, useEffect } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, Idl, Wallet } from "@project-serum/anchor";
import idl from "../idl.json";

const Init = ({boardId, setBoardId, setStatus, setBoard} : {boardId: string | null, setBoardId: React.Dispatch<React.SetStateAction<string | null>>, setStatus: React.Dispatch<React.SetStateAction<string>>, setBoard: React.Dispatch<React.SetStateAction<(string | null)[][]>>}) => {
    const [join, setJoin] = useState<boolean>(false);
    const inputBoardId = useRef<HTMLInputElement>(null);
    const wallet = useWallet();

    const connection = new Connection("https://api.devnet.solana.com", "processed");
    const programId = new PublicKey("8M4pLE5ir2ec6uf1bw5ydMyhgb6PZTxw1jyx8tHV5iat");
    const provider = new AnchorProvider(connection, (wallet as unknown) as Wallet, { preflightCommitment: "processed" });
    const program = new Program(idl as Idl, programId, provider);

    useEffect(() => {
        if (boardId === null) return;
        connection.onAccountChange(new PublicKey(boardId), (account) => {
            const board = program.coder.accounts.decode("Board", account.data);
            console.log(board);

            const newBoard = board.board.map((row: any) => row.map((cell: any) => {
                if (cell === null) 
                    return null;
                else 
                    return cell.red === undefined ? "yellow" : "red";
            }));
            setBoard(newBoard);

            if (board.phase.waiting !== undefined)
                setStatus(`Waiting for another player to join... (invite code: ${board.boardId})`);
            else if (board.phase.turn !== undefined) {
                if (board.phase.turn.red !== undefined && board.red === wallet.publicKey!)
                    setStatus("Your turn!");
                else
                    setStatus("Waiting for opponent's turn...");
            } else if (board.phase.winner !== undefined) {
                if (board.phase.winner.red !== undefined && board.red === wallet.publicKey!)
                    setStatus("You won!");
                else
                    setStatus("You lost!");
            } else if (board.phase.tie !== undefined)
                setStatus("Tie!");
        });
        return () => { };
    }, [boardId]);
        

    const createBoard = async () => {
        const inviteCode = (Math.random() + 1).toString(36).substring(5);
        const [boardId, _] = PublicKey.findProgramAddressSync([Buffer.from("board"), wallet.publicKey!.toBuffer(), Buffer.from(inviteCode)], programId);
        setBoardId(boardId.toString());

        const tx = await program.methods
            .initializeBoard(inviteCode)
            .accounts({
                board: boardId,
                signer: wallet.publicKey!,
            })
            .transaction();
        
        const latestBlockhash = await connection.getLatestBlockhash();
        tx.recentBlockhash = latestBlockhash.blockhash;
        tx.feePayer = wallet.publicKey!;
        
        const signedTx = await wallet.signTransaction!(tx);
        const txid = await connection.sendRawTransaction(signedTx.serialize());
    };

    const joinBoard = async () => {
        const value = inputBoardId.current?.value;
        if (value === undefined) return;
        const boards = await program.account.board.all();        
        const board = boards.find((board) => board.account.boardId === value);
        if (board === undefined) return;
        setBoardId(board.publicKey.toString());

        const tx = await program.methods
            .addPlayer()
            .accounts({
                board: board.publicKey,
                signer: wallet.publicKey!,
            })
            .transaction();
        
        const latestBlockhash = await connection.getLatestBlockhash();
        tx.recentBlockhash = latestBlockhash.blockhash;
        tx.feePayer = wallet.publicKey!;

        const signedTx = await wallet.signTransaction!(tx);
        const txid = await connection.sendRawTransaction(signedTx.serialize());
    };

    return (
        <div className="flex justify-center items-center bg-green-200" style={{height: "10%"}}>
            {wallet.publicKey ? (
                <>
                {(boardId === null) ? (
                    <>
                        {!join ? (
                            <>
                                <button
                                    type="button"
                                    className="w-28 rounded-md border border-gray-300 bg-white py-1.5 px-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 mr-1"
                                    onClick={createBoard}
                                >
                                    Create Board
                                </button>
                                <button
                                    className="w-28 rounded-md border border-gray-300 bg-white py-1.5 px-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 ml-1"
                                    onClick={() => setJoin(true)}
                                >
                                    Join Board
                                </button>
                            </>) :
                            <>
                                <input
                                    type="text"
                                    className="w-40 rounded-md border border-gray-300 bg-white py-1.5 px-2.5 text-sm text-gray-900 shadow-sm hover:bg-gray-50 mr-1"
                                    placeholder="Enter board ID"
                                    ref={inputBoardId}
                                />
                                <button
                                    className="w-16 rounded-md border border-gray-300 bg-white py-1.5 px-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 ml-1"
                                    onClick={joinBoard}
                                >
                                    Join
                                </button>
                            </>
                        }
                    </>
                ) : (<div className="text-sm font-semibold text-gray-700 ">Board ID: {boardId}</div>)
                } </>
            ) : <div>Connect to play</div>}
        </div>
    );
};

export default Init;