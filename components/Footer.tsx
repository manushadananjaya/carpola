import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#03071E] via-[#03071E] to-[#370617] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Us Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-[#FFBA08]">
              About Us
            </h2>
            <p className="text-sm leading-relaxed">
              We are a leading platform for buying and selling vehicles in Sri
              Lanka. Our mission is to provide a seamless experience for both
              buyers and sellers.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-[#FFBA08]">
              Quick Links
            </h2>
            <ul className="space-y-2">
              {/* Using specific paths for each link */}
              <li>
                <Link
                  href="/"
                  className="text-sm hover:text-[#F48C06] transition-colors duration-200 group flex items-center"
                >
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-sm hover:text-[#F48C06] transition-colors duration-200 group flex items-center"
                >
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  Search
                </Link>
              </li>
              <li>
                <Link
                  href="/post-ad"
                  className="text-sm hover:text-[#F48C06] transition-colors duration-200 group flex items-center"
                >
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  Sell Your Vehicle
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm hover:text-[#F48C06] transition-colors duration-200 group flex items-center"
                >
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm hover:text-[#F48C06] transition-colors duration-200 group flex items-center"
                >
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm hover:text-[#F48C06] transition-colors duration-200 group flex items-center"
                >
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-sm hover:text-[#F48C06] transition-colors duration-200 group flex items-center"
                >
                  <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-[#FFBA08]">
              Contact Us
            </h2>
            <p className="text-sm">123 Main Street, Colombo, Sri Lanka</p>
            <p className="text-sm">Phone: +94 78 777 0284</p>
            <p className="text-sm">Email: carpola.lk@gmail.com</p>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4 text-[#FFBA08]">
              Newsletter
            </h2>
            <p className="text-sm mb-2">Stay updated with our latest offers</p>
            <form className="flex space-x-2">
              <Input
                type="email"
                placeholder="Your email"
                className="flex-grow bg-black text-white"
                required
              />
              <Button
                type="submit"
                className="bg-[#370617] hover:bg-[#F48C06] text-white transition-colors duration-200"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <Separator className="my-8 bg-[#F48C06]" />

        {/* Footer Bottom Section */}
        <div className="flex flex-col items-center space-y-4 md:flex-row md:justify-between md:space-y-0">
          <div className="flex items-center space-x-2">
            <Image
              src="/assets/logo-removebg.png"
              alt="Carpola.lk"
              width={100}
              height={50}
              className="transition-transform duration-300 hover:scale-105"
            />
            <p className="text-sm font-medium">
              &copy; {new Date().getFullYear()} Carpola.lk. All rights reserved.
            </p>
          </div>

          {/* Made with Love Section */}
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Made with</p>
            <Heart className="h-4 w-4 text-[#FF6F61] animate-pulse" />
            <p className="text-sm font-medium">by</p>
            <Image
              src="/assets/mintleaf.png"
              alt="MintLeaf LABS"
              width={100}
              height={50}
              className="transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <Link href="https://www.facebook.com" aria-label="Facebook">
              <Facebook className="h-5 w-5 text-[#F48C06] hover:text-[#F48C06] transition-colors duration-200 transform hover:scale-110" />
            </Link>
            <Link href="https://www.twitter.com" aria-label="Twitter">
              <Twitter className="h-5 w-5 text-[#F48C06] hover:text-[#FFBA08] transition-colors duration-200 transform hover:scale-110" />
            </Link>
            <Link href="https://www.instagram.com" aria-label="Instagram">
              <Instagram className="h-5 w-5 text-[#F48C06] hover:text-[#FFBA08] transition-colors duration-200 transform hover:scale-110" />
            </Link>
            <Link href="https://www.linkedin.com" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5 text-[#F48C06] hover:text-[#FFBA08] transition-colors duration-200 transform hover:scale-110" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
