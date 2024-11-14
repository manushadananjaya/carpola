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
import Image from "next/image";

export function Navbar() {
  return (
    <header
      className="px-4 lg:px-6 flex items-center justify-between text-white shadow-md relative w-full z-50 bg-gradient-to-r from-[#03071E] via-[#370617] to-[#9D0208]"
      style={{
        minHeight: "calc(4rem + env(safe-area-inset-top))",
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <Link
        className="flex items-center justify-center transition-transform duration-300 hover:scale-105 z-10"
        href="/"
      >
        <Image
          src="/assets/logo.jpg"
          width={208}
          height={208}
          alt="Carpola.lk"
        />
      </Link>

      <nav className="flex items-center gap-4 sm:gap-6 z-10">
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/search"
            className="text-sm font-medium hover:text-[#FAA307] transition-colors duration-200 relative group"
          >
            Find Your Vehicle
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#D00000] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
          </Link>
          <Link
            href="/my-ads"
            className="text-sm font-medium hover:text-[#FAA307] transition-colors duration-200 relative group"
          >
            Sell
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#D00000] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:text-[#FAA307] transition-colors duration-200 relative group"
          >
            About
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#D00000] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium hover:text-[#FAA307] transition-colors duration-200 relative group"
          >
            Contact
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#D00000] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
          </Link>
          <Link href="/post-ad">
            <Button
              variant="outline"
              className="bg-[#FFBA08] hover:bg-[#F48C06] text-black hover:text-white border-[#FFBA08] hover:border-[#fb8500] font-semibold px-4 py-2 rounded-full transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Post Free Ad
            </Button>
          </Link>
        </div>
        <AuthButton />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-[#023047] border border-white transition-colors duration-200"
            >
              <Car className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-[#03071E] text-white border-gray-700"
          >
            <DropdownMenuItem asChild>
              <Link
                href="/search"
                className="hover:bg-[#370617] py-2 px-4 transition-colors duration-200"
              >
                Find Your Vehicle
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/my-ads"
                className="hover:bg-[#370617] py-2 px-4 transition-colors duration-200"
              >
                Sell
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/about"
                className="hover:bg-[#370617] py-2 px-4 transition-colors duration-200"
              >
                About
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/contact"
                className="hover:bg-[#370617] py-2 px-4 transition-colors duration-200"
              >
                Contact
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/post-ad"
                className="flex items-center bg-[#FFBA08] hover:bg-[#F48C06] text-black hover:text-white py-2 px-4 mt-2 transition-colors duration-200"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                <span className="font-semibold">Post Free Ad</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
}
