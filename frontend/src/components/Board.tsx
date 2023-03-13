import React, { useState } from "react";

export type TBoard = Array<Array<"red" | "yellow" | null>>;

const Board = ({board}: {board: TBoard}) => {
    const renderColumn = (col: number) => {
        return (
            <div 
                className="bg-blue-300 h-auto w-auto inline-block"
                onClick={() => { console.log(`clicked on column ${col}`)}}
                key={col}
            >
                {board.map((row, i) =>
                    <div
                        className="bg-white h-7 w-7 rounded-full border-blue-300 border-4"
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