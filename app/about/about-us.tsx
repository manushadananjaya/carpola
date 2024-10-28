import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Car, Users, Star, Shield } from "lucide-react";
import Link from "next/link";

export default function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        About Vehicle Market
      </h1>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Vehicle Market was founded in 2020 with a simple mission: to create
            a seamless and trustworthy platform for buying and selling vehicles
            in Sri Lanka. Our team of automotive enthusiasts and tech experts
            came together to revolutionize the way people trade vehicles online.
          </p>
          <p className="text-gray-600">
            Since our inception, we've helped thousands of buyers find their
            perfect ride and assisted countless sellers in finding the right
            buyers for their vehicles. Our commitment to transparency, security,
            and user satisfaction has made us the go-to marketplace for vehicle
            transactions in Sri Lanka.
          </p>
        </div>
        <div className="relative h-64 md:h-auto">
          <img
            src="/placeholder.svg?height=400&width=600"
            alt="Vehicle Market Team"
            className="rounded-lg object-cover w-full h-full"
          />
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-6 text-center">
        Why Choose Vehicle Market?
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          {
            title: "Wide Selection",
            icon: Car,
            description:
              "Access to a vast range of vehicles from trusted sellers across Sri Lanka.",
          },
          {
            title: "User-Friendly",
            icon: Users,
            description:
              "Intuitive platform designed for easy browsing, listing, and communication.",
          },
          {
            title: "Verified Listings",
            icon: Shield,
            description:
              "All listings are verified to ensure authenticity and prevent fraud.",
          },
          {
            title: "Expert Support",
            icon: Star,
            description:
              "Dedicated customer support team to assist you throughout your journey.",
          },
        ].map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <item.icon className="w-6 h-6 mr-2" />
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{item.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 mb-6">
          Join thousands of satisfied users and find your perfect vehicle today!
        </p>
        <Button size="lg">
          <Link href="/search">Search Your Dream Vehicle</Link>
        </Button>
      </div>
    </div>
  );
}
