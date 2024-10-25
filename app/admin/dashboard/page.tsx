"use client";

import { useState, useEffect } from "react";
import { Search, Check, X, Star, Zap, Trash2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/Navbar";

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
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ads, setAds] = useState<Ad[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    promoted: 0,
    featured: 0,
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      if (!session?.user?.isAdmin) {
        router.push("/403");
      } else {
        fetchAds();
        fetchStats();
      }
    }
  }, [status, session, router]);

  const fetchAds = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ads");
      const data = await response.json();
      setAds(data);
    } catch (error) {
      console.error("Error fetching ads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/ads/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleApprove = async (adId: string) => {
    try {
      await fetch(`/api/ads/approve/${adId}`, { method: "POST" });
      await fetchAds(); // Refetch ads to reflect the update
      await fetchStats(); // Update the stats accordingly
      setSuccessMessage("Ad approved successfully!"); // Set success message
      setTimeout(() => setSuccessMessage(null), 3000); // Hide message after 3 seconds
    } catch (error) {
      console.error("Failed to approve ad:", error);
    }
  };



  const handleReject = async (adId: string) => {
    try {
      await fetch(`/api/ads/${adId}/reject`, { method: "POST" });
      await fetchAds();
      await fetchStats();
    } catch (error) {
      console.error("Failed to reject ad:", error);
    }
  };

  const handlePromote = async (adId: string) => {
    try {
      await fetch(`/api/ads/${adId}/promote`, { method: "POST" });
      await fetchAds();
      await fetchStats();
    } catch (error) {
      console.error("Failed to promote ad:", error);
    }
  };

  const handleFeature = async (adId: string) => {
    try {
      await fetch(`/api/ads/${adId}/feature`, { method: "POST" });
      await fetchAds();
      await fetchStats();
    } catch (error) {
      console.error("Failed to feature ad:", error);
    }
  };

  const handleDelete = async (adId: string) => {
    try {
      await fetch(`/api/delete-ad/${adId}`, { method: "DELETE" });
      await fetchAds();
      await fetchStats();
    } catch (error) {
      console.error("Failed to delete ad:", error);
    }
  };

  const filteredAds = ads.filter(
    (ad) =>
      `${ad.brand} ${ad.model} ${ad.year}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (ad.description?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false)
  );

  const pendingAds = filteredAds.filter((ad) => !ad.promoted && !ad.featured);
  const approvedAds = filteredAds.filter((ad) => !ad.promoted && !ad.featured);
  const promotedAds = filteredAds.filter((ad) => ad.promoted);
  const featuredAds = filteredAds.filter((ad) => ad.featured);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      {/* Success Message */}
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
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Pending Ads</h3>
              <p className="text-2xl font-bold text-blue-600">
                {stats.pending}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Approved Ads</h3>
              <p className="text-2xl font-bold text-green-600">
                {stats.approved}
              </p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800">Promoted Ads</h3>
              <p className="text-2xl font-bold text-purple-600">
                {stats.promoted}
              </p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800">Featured Ads</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.featured}
              </p>
            </div>
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
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="promoted">Promoted</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <AdTable
              ads={pendingAds}
              onApprove={handleApprove}
              onReject={handleReject}
              onPromote={handlePromote}
              onFeature={handleFeature}
              onDelete={handleDelete}
            />
          </TabsContent>
          <TabsContent value="approved">
            <AdTable
              ads={approvedAds}
              onApprove={handleApprove}
              onReject={handleReject}
              onPromote={handlePromote}
              onFeature={handleFeature}
              onDelete={handleDelete}
            />
          </TabsContent>
          <TabsContent value="promoted">
            <AdTable
              ads={promotedAds}
              onApprove={handleApprove}
              onReject={handleReject}
              onPromote={handlePromote}
              onFeature={handleFeature}
              onDelete={handleDelete}
            />
          </TabsContent>
          <TabsContent value="featured">
            <AdTable
              ads={featuredAds}
              onApprove={handleApprove}
              onReject={handleReject}
              onPromote={handlePromote}
              onFeature={handleFeature}
              onDelete={handleDelete}
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
  onReject,
  onPromote,
  onFeature,
  onDelete,
}: {
  ads: Ad[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onPromote: (id: string) => void;
  onFeature: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ads.map((ad) => (
          <TableRow key={ad.adId}>
            <TableCell>{`${ad.brand} ${ad.model} ${ad.year}`}</TableCell>
            <TableCell>${ad.price}</TableCell>
            <TableCell>{ad.vehicleType}</TableCell>
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
                        onClick={() => onReject(ad.adId)}
                      >
                        Reject
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button size="sm" onClick={() => onApprove(ad.adId)}>
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onReject(ad.adId)}
                >
                  <X className="w-4 h-4" />
                </Button>
                {!ad.promoted && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onPromote(ad.adId)}
                  >
                    <Star className="w-4 h-4" />
                  </Button>
                )}
                {!ad.featured && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onFeature(ad.adId)}
                  >
                    <Zap className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(ad.adId)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
