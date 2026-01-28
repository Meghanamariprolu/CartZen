"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await fetch("/api/logout", { method: "POST" });

      localStorage.clear();
      sessionStorage.clear();

      router.push("/login");
    };

    logout();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Logging out...
        </h2>
        <p className="text-center text-gray-600">
          You will be redirected shortly.
        </p>
      </div>
    </div>
  );
}
