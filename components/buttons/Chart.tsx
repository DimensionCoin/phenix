import React from 'react'
import { FaChartBar } from 'react-icons/fa'
import { Button } from '../ui/button'

const Chart = () => {
  return (
    <button className="flex flex-col items-center justify-center w-20 h-20 p-1 bg-[#3d3c3d56] hover:bg-[#464446] rounded-xl shadow-md shadow-[#d76ffa70]">
      <FaChartBar className="w-5 h-5 text-purple-400" />
      <span className="mt-2 text-xs text-gray-300">Charts</span>
    </button>
  );
}

export default Chart
