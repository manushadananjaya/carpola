"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Check,
  Star,
  Zap,
  Trash2,
  X,
  CalendarDays,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/Navbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Ad = {
  adId: string;
  description?: string;
  price: number;
  featured: boolean;
  promoted: boolean;
  createdAt: string;
  userId: string;
  vehicleType: "VEHICLE" | "BIKE";
  brand: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: string;
  gear: string;
  engine: number;
  images: string[];
  user: {
    userId: string;
    username: string;
    userEmail: string;
    userPhone: string;
    userCity: string;
    userDistrict: string;
  };
  promotionExpired?: boolean;
  promotionExpiryDate?: string;
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ads, setAds] = useState<Ad[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      if (!session?.user?.isAdmin) {
        router.push("/403");
      } else {
        fetchAds();
      }
    }
  }, [status, session, router]);

  const stats = useMemo(() => {
    return {
      pending: ads.filter((ad) => !ad.promoted && !ad.featured).length,
      approved: ads.filter((ad) => !ad.promoted && !ad.featured).length,
      promoted: ads.filter((ad) => ad.promoted).length,
      featured: ads.filter((ad) => ad.featured).length,
      expired: ads.filter((ad) => ad.promotionExpired).length,
    };
  }, [ads]);

  const fetchAds = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ads/pending");
      const data = await response.json();
      setAds(data);
    } catch (error) {
      console.error("Error fetching ads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApproved = async () => {
    try {
      const response = await fetch("/api/ads/approved");
      const data = await response.json();
      setAds(data);
    } catch (error) {
      console.error("Error fetching approved ads:", error);
    }
  };

  const fetchFeatured = async () => {
    try {
      const response = await fetch("/api/ads/featured");
      const data = await response.json();
      const formattedAds = data.map((featuredAd: any) => ({
        ...featuredAd.ad,
        featured: true,
        promotionExpiryDate: featuredAd.expiryDate,
      }));
      setAds(formattedAds);
    } catch (error) {
      console.error("Error fetching featured ads:", error);
    }
  };

  const fetchPromoted = async () => {
    try {
      const response = await fetch("/api/ads/promoted");
      const data = await response.json();

      // Current date for checking expiration
      const currentDate = new Date();

      const formattedAds = data.map((promotedAd: { promotionExpiresAt: any; ad: any; featured: any; }) => {
        const { promotionExpiresAt, ad, featured } = promotedAd;

        // Check if the promotion has expired locally
        const isExpired = new Date(promotionExpiresAt) < currentDate;

        return {
          ...ad,
          promoted: true,
          featured,
          promotionExpiryDate: promotionExpiresAt,
          promotionExpired: isExpired,
        };
      });

      setAds(formattedAds);
    } catch (error) {
      console.error("Error fetching promoted ads:", error);
    }
  };



  const fetchExpired = async () => {
    try {
      const response = await fetch("/api/ads/expired");
      const data = await response.json();
      const formattedAds = data.map((expiredAd: any) => ({
        ...expiredAd.ad,
        promotionExpired: true,
        promotionExpiryDate: expiredAd.expiryDate,
      }));
      setAds(formattedAds);
    } catch (error) {
      console.error("Error fetching expired ads:", error);
    }
  };

  const handleApprove = async (adId: string) => {
    try {
      await fetch(`/api/ads/approve/${adId}`, { method: "POST" });
      await fetchAds();
      setSuccessMessage("Ad approved successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Failed to approve ad:", error);
    }
  };

  const handlePromote = async (adId: string, duration: number) => {
    try {
      await fetch(`/api/ads/promote/${adId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ duration }),
      });
      await fetchAds();
      setSuccessMessage(`Ad promoted for ${duration} days successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Failed to promote ad:", error);
    }
  };

  const handleFeature = async (adId: string) => {
    try {
      await fetch(`/api/ads/feature/${adId}`, { method: "POST" });
      await fetchAds();
    } catch (error) {
      console.error("Failed to feature ad:", error);
    }
  };

  const handleDelete = async (adId: string) => {
    try {
      const response = await fetch(`/api/delete-ad/${adId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchAds();
        setSuccessMessage("Ad deleted successfully. User has been notified.");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error("Failed to delete ad");
      }
    } catch (error) {
      console.error("Failed to delete ad:", error);
      setSuccessMessage("Failed to delete ad. Please try again.");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleCancelPromotion = async (adId: string) => {
    try {
      await fetch(`/api/ads/cancel-promotion/${adId}`, { method: "POST" });
      setSuccessMessage("Promotion cancelled successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Failed to cancel promotion:", error);
    }
  };

  const handleCancelAllPromotions = async () => {
    try {
      await fetch(`/api/ads/cancel-all-promotions`, { method: "POST" });
      setSuccessMessage("All expired promotions cancelled successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Failed to cancel all promotions:", error);
    }
  };

  const filteredAds = ads
    .filter(
      (ad) =>
        `${ad.brand} ${ad.model} ${ad.year}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (ad.description?.toLowerCase().includes(searchTerm.toLowerCase()) ??
          false)
    )
    .filter((ad) => {
      if (activeTab === "pending") return !ad.promoted && !ad.featured;
      if (activeTab === "approved") return !ad.promoted && !ad.featured;
      if (activeTab === "promoted") return ad.promoted && !ad.promotionExpired;
      if (activeTab === "featured") return ad.featured;
      if (activeTab === "expired") return ad.promotionExpired;
      return true;
    });




  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      {successMessage && (
        <div className="max-w-md mx-auto my-4 p-4 bg-green-100 text-green-700 rounded-lg shadow-lg">
          {successMessage}
        </div>
      )}
      <main className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1">
            {activeTab === "pending" && (
              <div className="bg-blue-100 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">Pending Ads</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.pending}
                </p>
              </div>
            )}
            {activeTab === "approved" && (
              <div className="bg-green-100 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800">Approved Ads</h3>
                <p className="text-2xl font-bold text-green-600">
                  {stats.approved}
                </p>
              </div>
            )}
            {activeTab === "promoted" && (
              <div className="bg-purple-100 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800">Promoted Ads</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.promoted}
                </p>
              </div>
            )}
            {activeTab === "featured" && (
              <div className="bg-yellow-100 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800">Featured Ads</h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.featured}
                </p>
              </div>
            )}
            {activeTab === "expired" && (
              <div className="bg-red-100 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800">
                  Expired Promotions
                </h3>
                <p className="text-2xl font-bold text-red-600">
                  {stats.expired}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search ads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Tabs
          defaultValue="pending"
          onValueChange={(value) => {
            setActiveTab(value);
            if (value === "approved") {
              fetchApproved();
            } else if (value === "pending") {
              fetchAds();
            } else if (value === "promoted") {
              fetchPromoted();
            } else if (value === "featured") {
              fetchFeatured();
            } else if (value === "expired") {
              fetchExpired();
            }
          }}
        >
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="promoted">Promoted</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="expired">Expired Promotions</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {activeTab === "expired" && (
              <Button
                onClick={handleCancelAllPromotions}
                className="mb-4"
                variant="destructive"
              >
                Cancel All Expired Promotions
              </Button>
            )}
            <AdTable
              ads={filteredAds}
              onApprove={handleApprove}
              onPromote={handlePromote}
              onFeature={handleFeature}
              onDelete={handleDelete}
              onCancelPromotion={handleCancelPromotion}
              activeTab={activeTab}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function AdTable({
  ads,
  onApprove,
  onPromote,
  onFeature,
  onDelete,
  onCancelPromotion,
  activeTab,
}: {
  ads: Ad[];
  onApprove: (id: string) => void;
  onPromote: (id: string, duration: number) => void;
  onFeature: (id: string) => void;
  onDelete: (id: string) => void;
  onCancelPromotion: (id: string) => void;
  activeTab: string;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Type</TableHead>
          {(activeTab === "promoted" || activeTab === "featured") && (
            <TableHead>Expiry Date</TableHead>
          )}
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ads.map((ad) => (
          <TableRow key={ad.adId}>
            <TableCell>
              <div>{`${ad.brand} ${ad.model} ${ad.year}`}</div>
              <div className="text-sm text-gray-500">
                Ad ID: {ad.adId} <br />
                {ad.user.username} ({ad.user.userEmail}) <br />
                {ad.user.userCity}, {ad.user.userDistrict}
              </div>
            </TableCell>
            <TableCell>${ad.price}</TableCell>
            <TableCell>{ad.vehicleType}</TableCell>
            {(activeTab === "promoted" || activeTab === "expired") && (
              <TableCell>
                {ad.promotionExpiryDate
                  ? new Date(ad.promotionExpiryDate).toLocaleDateString()
                  : "N/A"}
              </TableCell>
            )}

            <TableCell>{ad.promotionExpired ? "Expired" : "Active"}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>{`${ad.brand} ${ad.model} ${ad.year}`}</DialogTitle>
                      <DialogDescription>
                        {ad.description || "No description available"}
                      </DialogDescription>
                      <div className="text-sm text-gray-500">
                        Ad ID: {ad.adId}
                        <br />
                        {ad.user.username} ({ad.user.userEmail})
                        <br />
                        {ad.user.userCity}, {ad.user.userDistrict}
                      </div>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Details</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="font-medium">Price:</span>
                            <span>${ad.price}</span>
                            <span className="font-medium">Mileage:</span>
                            <span>{ad.mileage} km</span>
                            <span className="font-medium">Fuel Type:</span>
                            <span>{ad.fuelType}</span>
                            <span className="font-medium">Gear:</span>
                            <span>{ad.gear}</span>
                            <span className="font-medium">Engine:</span>
                            <span>{ad.engine} cc</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">
                            Seller Information
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            <span className="font-medium">Name:</span>
                            <span>{ad.user.username}</span>
                            <span className="font-medium">Email:</span>
                            <span>{ad.user.userEmail}</span>
                            <span className="font-medium">Phone:</span>
                            <span>{ad.user.userPhone}</span>
                            <span className="font-medium">City:</span>
                            <span>{ad.user.userCity}</span>
                            <span className="font-medium">District:</span>
                            <span>{ad.user.userDistrict}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Images</h4>
                        <div className="grid grid-cols-5 gap-2">
                          {ad.images.slice(0, 5).map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`${ad.brand} ${ad.model} ${index + 1}`}
                              className="w-full h-24 object-cover rounded"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => onApprove(ad.adId)}>
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => onDelete(ad.adId)}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                {activeTab !== "expired" && (
                  <>
                    <Button size="sm" onClick={() => onApprove(ad.adId)}>
                      <Check className="w-4 h-4" />
                    </Button>
                    {!ad.promoted && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline">
                            Promote <Star className="w-4 h-4 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onSelect={() => onPromote(ad.adId, 7)}
                          >
                            7 Days
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => onPromote(ad.adId, 14)}
                          >
                            14 Days
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    {!ad.featured && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onFeature(ad.adId)}
                      >
                        Feature
                        <Zap className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(ad.adId)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
                {activeTab === "expired" && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onCancelPromotion(ad.adId)}
                  >
                    Cancel Promotion
                    <X className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
