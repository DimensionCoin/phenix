import React from "react";
import { IoMdSwap } from "react-icons/io";

const Swap = () => {
  return (
    <button className="flex flex-col items-center justify-center w-20 h-20 p-1 bg-[#3d3c3d56] hover:bg-[#464446] rounded-xl shadow-md shadow-[#d76ffa70]">
      <IoMdSwap className="w-5 h-5 text-purple-400" />
      <span className="mt-2 text-xs text-gray-300">Swap</span>
    </button>
  );
};

export default Swap;
