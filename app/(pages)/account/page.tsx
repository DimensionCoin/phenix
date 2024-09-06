"use client";
import React from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import { useSearchParams } from "next/navigation";
import AccountHero from "@/components/page/AccountHero";
import ProtocolCard from "@/components/page/ProtocolCard"; // Ensure this import is correct
import DownloadPWA from "@/components/page/DownloadPWA";

const Account = () => {
  const searchParams = useSearchParams();
  const portfolioValue = searchParams.get("portfolioValue");

  return (
    <div className="p-2">
      <Link href="/">
        <FaArrowLeft />
      </Link>
      <AccountHero />
      <div className="">
        <DownloadPWA />
      </div>
    </div>
  );
};

export default Account;
