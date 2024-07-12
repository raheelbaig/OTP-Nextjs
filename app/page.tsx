"use client";

import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <div className="h-16 border border-b-2 shadow-lg"></div>
      <main className="flex items-center flex-col p-24">
        <h1 className="font-bold text-3xl text-center mb-4">
          Welcome to the One Time Password authentication.
        </h1>

        {user ? (
          <h2>
            User Id:{" "}
            <span className="text-green-500 font-bold">{user?.uid}</span>
          </h2>
        ) : (
          <h2>You are not logged in</h2>
        )}

        {user ? (
          <Button onClick={() => signOut(auth)} className="mt-10">
            Sign Out
          </Button>
        ) : (
          <Link href="/login" className="mt-10">
            <Button>Sign In</Button>
          </Link>
        )}
      </main>
    </>
  );
}
