import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">About Us</h2>
            <p className="text-sm">
              We are a leading platform for buying and selling vehicles in Sri
              Lanka. Our mission is to provide a seamless experience for both
              buyers and sellers.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-sm hover:underline">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/post-ad" className="text-sm hover:underline">
                  Sell Your Vehicle
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm hover:underline"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-sm hover:underline"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Contact Us</h2>
            <p className="text-sm">123 Main Street, Colombo, Sri Lanka</p>
            <p className="text-sm">Phone: +94 11 234 5678</p>
            <p className="text-sm">Email: info@Carpola.lk</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Newsletter</h2>
            <p className="text-sm mb-2">Stay updated with our latest offers</p>
            <form className="flex space-x-2">
              <Input
                type="email"
                placeholder="Your email"
                className="flex-grow"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col items-center space-y-4 md:flex-row md:justify-between md:space-y-0">
          <div className="flex items-center space-x-2">
            <Image
              src="/assets/logo-removebg.png"
              alt="Carpola.lk"
              width={100}
              height={50}
            />
            <p className="text-sm font-medium">
              &copy; {new Date().getFullYear()} Carpola.lk. All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Made with</p>
            <Heart className="h-4 w-4 text-red-500" />
            <p className="text-sm font-medium">by</p>
            <Image
              src="/assets/mintleaf.png"
              alt="MintLeaf LABS"
              width={100}
              height={50}
            />
          </div>
          <div className="flex space-x-4">
            <Link href="#" aria-label="Facebook">
              <Facebook className="h-5 w-5 text-gray-600 hover:text-gray-800" />
            </Link>
            <Link href="#" aria-label="Twitter">
              <Twitter className="h-5 w-5 text-gray-600 hover:text-gray-800" />
            </Link>
            <Link href="#" aria-label="Instagram">
              <Instagram className="h-5 w-5 text-gray-600 hover:text-gray-800" />
            </Link>
            <Link href="#" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5 text-gray-600 hover:text-gray-800" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
