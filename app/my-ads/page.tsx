"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, Star, Check } from "lucide-react";
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
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";

type Ad = {
  id: string;
  title: string;
  price: number;
  status: "under review" | "approved" | "rejected";
  imageUrl: string;
  promoted: boolean;
  featured: boolean;
};

type Package = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  color: string;
};

export default function MyAds() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingAdId, setDeletingAdId] = useState<string | null>(null);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const supportMessage = encodeURIComponent(
    "Hi, I need more support regarding upgrading my ad. Can you help?"
  );

  const packages: Package[] = [
    {
      id: "1",
      name: "Basic",
      price: 9.99,
      description: "Perfect for beginners",
      features: ["1 promoted ad", "24-hour boost", "Basic analytics"],
      color: "bg-blue-500",
    },
    {
      id: "2",
      name: "Premium",
      price: 19.99,
      description: "For serious sellers",
      features: [
        "3 promoted ads",
        "72-hour boost",
        "Advanced analytics",
        "Priority support",
      ],
      color: "bg-purple-500",
    },
    {
      id: "3",
      name: "Pro",
      price: 39.99,
      description: "Maximum visibility",
      features: [
        "Unlimited promoted ads",
        "1-week boost",
        "Real-time analytics",
        "Dedicated account manager",
        "Featured seller badge",
      ],
      color: "bg-green-500",
    },
  ];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchAds();
    }
  }, [status, router]);

  const fetchAds = async () => {
    try {
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

  const handleDeleteAd = async (adId: string) => {
    setDeletingAdId(adId);
    try {
      const response = await fetch(`/api/delete-ad/${adId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete ad");
      setAds(ads.filter((ad) => ad.id !== adId));
    } catch (err) {
      setError("Failed to delete the ad. Please try again.");
    } finally {
      setDeletingAdId(null);
    }
  };

  const handlePromoteAd = (adId: string) => {
    const promoteMessage = encodeURIComponent(
      `Hello, I would like to promote my ad with ID ${adId}. Can you assist?`
    );
    window.location.href = `https://wa.me/${whatsappNumber}?text=${promoteMessage}`;
  };

  const handleUpgradePackage = (pkgName: string) => {
    const upgradeMessage = encodeURIComponent(
      `I would like to upgrade to the ${pkgName} package. Can you help with the process?`
    );
    window.location.href = `https://wa.me/${whatsappNumber}?text=${upgradeMessage}`;
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
      <main className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">My Ads</h1>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {ads.map((ad) => (
            <Card key={ad.id} className="overflow-hidden">
              <Link href={`/vehicles/${ad.id}`}>
              <img
                src={ad.imageUrl}
                alt={ad.title}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle>{ad.title}</CardTitle>
                <CardDescription>Price: LKR {ad.price}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
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
                  {ad.promoted && <Badge variant="default">Promoted</Badge>}
                  {ad.featured && <Badge variant="default">Featured</Badge>}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteAd(ad.id)}
                  disabled={deletingAdId === ad.id}
                >
                  {deletingAdId === ad.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </>
                  )}
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
              </Link>
            </Card>
          ))}
        </div>

        <h2 className="text-3xl font-bold mt-12 mb-6 text-center">
          Upgrade Your Ads
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="flex flex-col">
              <CardHeader className={`${pkg.color} text-white`}>
                <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                <CardDescription className="text-white text-opacity-90 text-lg">
                  ${pkg.price}/month
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                <ul className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-5 h-5 mr-2 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleUpgradePackage(pkg.name)}
                >
                  {`Choose ${pkg.name}`}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <p>If you need more support, contact us at:</p>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${supportMessage}`}
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp Support: {whatsappNumber}
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
