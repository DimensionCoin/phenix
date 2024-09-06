"use client";

import { useState, useEffect } from "react";

// Define the BeforeInstallPromptEvent interface
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPWA() {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      console.log("beforeinstallprompt event fired");
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
      console.log("PWA install prompt is available");
    };

    window.addEventListener("beforeinstallprompt", handler as EventListener);

    return () => {
      console.log("Cleaning up beforeinstallprompt event listener");
      window.removeEventListener(
        "beforeinstallprompt",
        handler as EventListener
      );
    };
  }, []);

  const onClick = async (evt: React.MouseEvent) => {
    evt.preventDefault();
    console.log("Install button clicked");
    if (promptInstall) {
      console.log("Prompting PWA installation");
      promptInstall.prompt();
      const choiceResult = await promptInstall.userChoice;
      console.log(`User choice: ${choiceResult.outcome}`);
      if (choiceResult.outcome === "accepted") {
        console.log("PWA setup accepted");
      } else {
        console.log("PWA setup dismissed");
      }
      setPromptInstall(null); // Clear the promptInstall after handling
    }
  };

  if (!supportsPWA) {
    console.log("PWA not supported, not rendering the install button");
    return null;
  }

  console.log("Rendering the install button");
  return (
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none"
      id="setup_button"
      aria-label="Install app"
      title="Install app"
      onClick={onClick}
    >
      Install App
    </button>
  );
}
