"use client"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "@/context/UserContext";
import { useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaWallet } from "react-icons/fa6";


export default function Component() {
  const { user, refreshUser } = useUser();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const truncateAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-6)}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Wallet address copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy address");
    }
  };

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const handleAvatarClick = () => {
    fileInputRef.current?.click(); // Use optional chaining to safely access click
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload-avatar", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Avatar updated:", data.avatarUrl);
        refreshUser(); // Refresh user context to update avatar URL
      } else {
        console.error("Failed to upload avatar");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };
  return (
    <div className="flex items-center gap-4 p-4 px-2 bg-background rounded-lg shadow-sm">
      <Avatar className="h-10 w-10" onClick={handleAvatarClick}>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />
        <AvatarImage src={user?.avatarUrl || "https://github.com/shadcn.png"} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex-1 grid gap-1">
        <div className="flex items-center justify-between">
          <div className="font-semibold">{user?.username}</div>
          <p className="text-gray-600 text-xs">Member since: {joinDate}</p>
        </div>
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
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
