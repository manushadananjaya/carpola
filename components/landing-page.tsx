"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, Card } from "@/components/ui/card";
import { Search, Car, DollarSign, CheckCircle, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function LandingPageComponent() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between">
        <Link className="flex items-center justify-center" href="#">
          <Car className="h-6 w-6" />
          <span className="sr-only">AutoMarket</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Buy
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Sell
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-black flex justify-center items-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-white">
                  Find Your Perfect Ride
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                  Browse thousands of cars from trusted sellers. Buy or sell
                  with ease on AutoMarket.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1 text-white"
                    placeholder="Search by make, model, or keyword"
                    type="text"
                  />
                  <Button type="submit" variant="secondary">
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Search</span>
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 justify-center items-center flex">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">
              Featured Vehicles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Image
                      alt="Car Image"
                      className="rounded-lg object-cover w-full aspect-video mb-4"
                      height="200"
                      src={`/placeholder.svg?height=200&width=300`}
                      width="300"
                    />
                    <h3 className="text-lg font-bold mb-2">2023 Model Car</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      30,000 miles • Excellent condition
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">$25,000</span>
                      <Button variant="outline">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 justify-center items-center flex">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <Search className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Search</h3>
                <p className="text-gray-500">
                  Browse our extensive catalog of vehicles from trusted sellers.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Car className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Connect</h3>
                <p className="text-gray-500">
                  Contact sellers directly and schedule test drives.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <DollarSign className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Purchase</h3>
                <p className="text-gray-500">
                  Complete your purchase securely.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 flex justify-center items-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Sell Your Car?
                </h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl lg:text-base xl:text-xl">
                  List your vehicle on AutoMarket and reach thousands of
                  potential buyers.
                </p>
              </div>
              <Button className="w-full sm:w-auto" size="lg">
                List Your Vehicle
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">
          © 2024 AutoMarket. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
