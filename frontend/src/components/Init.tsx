import { useWallet } from "@solana/wallet-adapter-react";
import React, { useRef, useState } from "react";

const Init = ({boardId, setBoardId} : {boardId: string | null, setBoardId: React.Dispatch<React.SetStateAction<string | null>>}) => {
    const [join, setJoin] = useState<boolean>(false);
    const inputBoardId = useRef<HTMLInputElement>(null);
    const wallet = useWallet();

    const createBoard = () => {
    };

    const joinBoard = () => {
        const value = inputBoardId.current?.value;
        if (value === undefined) return;
        setBoardId(value);
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