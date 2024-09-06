"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import ScanQr from "../buttons/ScanQr";
import ViewTransactions from "../buttons/ViewTransactions";
import Balance from "../Header/Balance";
import ActionButtons from "../Header/ActionButtons";
import { MdKeyboardArrowDown } from "react-icons/md";
import Request from "../buttons/Request";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { FaWallet } from "react-icons/fa6";

interface HeaderProps {
  portfolioValue: string | number;
}

export default function Header({ portfolioValue }: HeaderProps) {
  const { user, setUser } = useUser();
  const router = useRouter();

  const truncateAddress = (address: string) =>
    `${address.slice(0, 4)}...${address.slice(-4)}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Wallet address copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy address");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setUser(null);
        router.push("/");
      } else {
        toast.error("Failed to logout");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="flex flex-col bg-background">
      <header className="flex items-center justify-between bg-background px-6 py-3 shadow-sm w-full">
        <div className="flex items-center gap-4">
          <Link href={`/account?portfolioValue=${portfolioValue}`}>
            <div className="border rounded-full p-1 shadow-md shadow-[#8837a8]">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={user?.avatarUrl || "https://github.com/shadcn.png"}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </Link>
          <Popover>
            <PopoverTrigger className="flex gap-3 items-center">
              <div className="flex gap-1 items-center">
                <div className="font-medium text-white">{user?.username}</div>
                <MdKeyboardArrowDown className="text-white" />
              </div>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto flex justify-center items-center flex-col p-4 mt-2 rounded-lg shadow-md shadow-[#62257a] bg-[#2a13337f] backdrop-blur-sm"
              align="center"
              alignOffset={20}
            >
              <div
                className="flex gap-3 items-center mb-2 cursor-pointer"
                onClick={() =>
                  user?.walletAddress && copyToClipboard(user.walletAddress)
                }
              >
                <FaWallet />
                <span>
                  {user?.walletAddress
                    ? truncateAddress(user.walletAddress)
                    : "No address"}
                </span>
              </div>
              <Button
                variant="outline"
                className="bg-[#2b2b2b] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#3a3a3a] mt-4"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-2 md:!text-inherit">
          <Request />
          <ScanQr />
          <ViewTransactions />
        </div>
      </header>
      <div className="mx-auto w-full p-2 px-3">
        <Balance portfolioValue={portfolioValue} />
      </div>
      <div className="mx-auto">
        <ActionButtons />
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
