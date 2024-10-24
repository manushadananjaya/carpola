"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Navbar } from "@/components/Navbar";

type Ad = {
  id: string;
  title: string;
  price: number;
  status: "under review" | "approved" | "rejected";
  imageUrl: string;
};

type Package = {
  id: string;
  name: string;
  price: number;
  description: string;
};

export default function MyAds() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ads, setAds] = useState<Ad[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchAds();
      fetchPackages();
    }
  }, [status, router]);

  const fetchAds = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/my-ads");
      if (!response.ok) throw new Error("Failed to fetch ads");
      const data = await response.json();
      setAds(data);
    } catch (err) {
      setError("Failed to load your ads. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/promotion-packages");
      if (!response.ok) throw new Error("Failed to fetch packages");
      const data = await response.json();
      setPackages(data);
    } catch (err) {
      console.error("Failed to load promotion packages:", err);
    }
  };

  const handleDeleteAd = async (adId: string) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/delete-ad/${adId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete ad");
      setAds(ads.filter((ad) => ad.id !== adId));
    } catch (err) {
      setError("Failed to delete the ad. Please try again.");
    }
  };

  const handlePromoteAd = (adId: string) => {
    // Implement promotion logic here
    console.log(`Promoting ad ${adId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">My Ads</h1>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <Card key={ad.id}>
              <CardHeader>
                <CardTitle>{ad.title}</CardTitle>
                <CardDescription>Price: ${ad.price}</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <Badge
                  variant={
                    ad.status === "approved"
                      ? "default"
                      : ad.status === "rejected"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {ad.status}
                </Badge>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteAd(ad.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePromoteAd(ad.id)}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Promote
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-6">Upgrade Your Ads</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card key={pkg.id}>
              <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
                <CardDescription>${pkg.price}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{pkg.description}</p>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">Choose Plan</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Upgrade</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to upgrade to the {pkg.name} plan
                        for ${pkg.price}?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline">Cancel</Button>
                      <Button>Confirm Upgrade</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
