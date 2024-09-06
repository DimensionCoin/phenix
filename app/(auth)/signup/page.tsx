"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          privateKey: privateKey || undefined, // Only include the private key if provided
        }),
      });

      if (response.ok) {
        // Redirect to the home page or dashboard on successful signup
        router.push("/");
      } else {
        const data = await response.json();
        setError(data.error || "Sign-up failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1a1a2e]">
      <Card className="w-full max-w-md bg-[#0f0f1f] text-white">
        <CardHeader className="text-center">
          <img src="/phenixlogo.png" alt="logo" className="w-60 h-60 mx-auto" />
          <CardTitle className="text-2xl">Phenix Wallet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wallet-key">Wallet Private Key (Optional)</Label>
              <Input
                id="wallet-key"
                type="text"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                placeholder="Enter your wallet private key"
                className="bg-[#1a1a2e] border-[#2a2a3e] text-white"
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-[#3a3a5e]"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            variant="ghost"
            className="text-[#6a6a8e]"
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
