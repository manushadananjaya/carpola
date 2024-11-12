"use client";

import { useState, useEffect } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`px-4 lg:px-6 h-16 flex items-center justify-between text-white shadow-md fixed w-full top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#023047]" : "bg-black"
      }`}
    >
      <Link
        className="flex items-center justify-center transition-transform duration-300 hover:scale-105"
        href="/"
      >
        <Image
          src="/assets/logo.jpg"
          width={48}
          height={48}
          alt="Carpola.lk"
          className="rounded-full border-2 border-[#219ebc]"
        />
        <span className="ml-2 text-xl font-bold tracking-tight">
          Carpola.lk
        </span>
      </Link>

      <nav className="flex items-center gap-4 sm:gap-6">
        <div className="hidden md:flex items-center gap-6">
          {/* Specific Links for Desktop */}
          <Link
            href="/search"
            className="text-sm font-medium hover:text-[#8ecae6] transition-colors duration-200 relative group"
          >
            Find Your Vehicle
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#ffb703] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
          </Link>
          <Link
            href="/my-ads"
            className="text-sm font-medium hover:text-[#8ecae6] transition-colors duration-200 relative group"
          >
            Sell
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#ffb703] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:text-[#8ecae6] transition-colors duration-200 relative group"
          >
            About
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#ffb703] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium hover:text-[#8ecae6] transition-colors duration-200 relative group"
          >
            Contact
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#ffb703] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
          </Link>
          <Link href="/post-ad">
            <Button
              variant="outline"
              className="bg-[#ffb703] hover:bg-[#fb8500] text-black hover:text-white border-[#ffb703] hover:border-[#fb8500] font-semibold px-4 py-2 rounded-full transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Post Free Ad
            </Button>
          </Link>
        </div>
        <AuthButton />

        {/* Mobile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-[#023047] transition-colors duration-200"
            >
              <Car className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-[#023047] text-white border-[#8ecae6]"
          >
            {/* Specific Links for Mobile */}
            <DropdownMenuItem asChild>
              <Link
                href="/search"
                className="hover:bg-[#00B8D9] py-2 px-4 transition-colors duration-200"
              >
                Find Your Vehicle
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/my-ads"
                className="hover:bg-[#00B8D9] py-2 px-4 transition-colors duration-200"
              >
                Sell
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/about"
                className="hover:bg-[#00B8D9] py-2 px-4 transition-colors duration-200"
              >
                About
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/contact"
                className="hover:bg-[#00B8D9] py-2 px-4 transition-colors duration-200"
              >
                Contact
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/post-ad"
                className="flex items-center bg-[#ffb703] hover:bg-[#fb8500] text-black hover:text-white py-2 px-4 mt-2 transition-colors duration-200"
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
