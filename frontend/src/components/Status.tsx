import React from "react";

const Status = ({status}: {status: string}) => {
    return (
        <div className="flex justify-center items-center bg-green-200" style={{height: "20%"}}>
            <div className="text-4xl font-semibold text-gray-700 ">{ status }</div>
        </div>
    );
};

export default Status;