"use client"; // Ensure this component runs on the client side

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AuthButton() {
  // Use useSession hook to get session data
  const { data: session } = useSession();
  
  console.log("seisson from auth button" , session);

  // If session exists, display dropdown with user information
  if (session && session.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "User Avatar"}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <User className="h-4 w-4" />
            )}
            <span className="sr-only">User menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <Link href="/user" passHref>
            <DropdownMenuItem className="font-normal cursor-pointer">
              <div className="flex flex-col space-y-1">
                {/* Display user's name and email */}
                <p className="text-sm font-medium leading-none">
                  {session.user.name} (ID: {session.user.id})
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session.user.email}
                </p>
              </div>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem onClick={() => signOut()}>
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // If no session (i.e., user is not logged in), display sign-in button
  return (
    <Button variant="ghost" onClick={() => signIn()}>
      Sign in
    </Button>
  );
}
