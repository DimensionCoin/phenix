import React from 'react'
import { MdQrCodeScanner } from 'react-icons/md';
import { Button } from '../ui/button';

const ScanQr = () => {
  return (
    <button className="flex flex-col items-center justify-center w-10 h-10 p-1 bg-[#3d3c3d56] hover:bg-[#464446] rounded-lg">
      <MdQrCodeScanner className="w-4 h-4 text-purple-400" />
      
    </button>
  );
}

export default ScanQr
