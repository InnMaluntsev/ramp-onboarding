"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Legacy redirect for the old /steps route
export default function StepsPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the web3-workshop lab (the original workshop)
    router.push("/labs/web3-workshop");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Redirecting to Web3 Workshop...</p>
      </div>
    </div>
  );
}