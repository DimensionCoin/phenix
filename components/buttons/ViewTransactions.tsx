import React from 'react'
import { Button } from '../ui/button';
import { FaBoltLightning } from 'react-icons/fa6';

const ViewTransactions = () => {
  return (
    <button className="flex flex-col items-center justify-center w-10 h-10 p-1 bg-[#3d3c3d56] hover:bg-[#464446] rounded-lg">
      <FaBoltLightning className="w-4 h-4 text-purple-400" />
      
    </button>
  );
}

export default ViewTransactions
