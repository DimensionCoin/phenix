import React from "react";
import Recieve from "../buttons/Recieve";
import Send from "../buttons/Send";
import Swap from "../buttons/Swap";
import Chart from "../buttons/Chart";
import Request from "../buttons/Request";

const ActionButtons = () => {
  return (
    <div className="flex justify-center gap-6 py-4 max-w-md ">
      <Recieve />
      <Send /> <Swap />
      <Chart />
    </div>
  );
};

export default ActionButtons;
