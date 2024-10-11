"use client";

import Link from "next/link";
import { Car, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AuthButton from "./AuthButton";

export function Navbar() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center justify-between border-b">
      <Link className="flex items-center justify-center" href="/">
        <Car className="h-6 w-6" />
        <span className="ml-2 text-lg font-semibold">AutoMarket</span>
      </Link>
      <nav className="flex items-center gap-4 sm:gap-6">
        <div className="hidden md:flex items-center gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/buy"
          >
            Buy
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/sell"
          >
            Sell
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/about"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/contact"
          >
            Contact
          </Link>
          <Link href="/post-ad">
            <Button
              variant="outline"
              className="bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-400 hover:border-yellow-500"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Post Free Ad
            </Button>
          </Link>
        </div>
        <AuthButton />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Car className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/buy">Buy</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/sell">Sell</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/about">About</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/contact">Contact</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/post-ad" className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4 text-yellow-500" />
                <span className="text-yellow-500 font-semibold">
                  Post Free Ad
                </span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
}
