"use client";

import { useState, useEffect } from "react";
import { Search, Check, X, Star, Zap } from "lucide-react";
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
  id: string;
  title: string;
  description: string;
  price: number;
  status: "pending" | "approved" | "rejected";
  featured: boolean;
  promoted: boolean;
  createdAt: string;
  userId: string;
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ads, setAds] = useState<Ad[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("session", session);

    if (status === "loading") {
      // Wait for session data to load
      return;
    }

    // Redirect to sign-in page if user is not authenticated
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      // Redirect if user is not an admin
      if (!session?.user?.isAdmin) {
        router.push("/403"); // Redirect to a custom "403 Forbidden" page or homepage
      } else {
        // Fetch ads if user is authenticated and is an admin
        fetchAds();
      }
    }
  }, [status, session, router]);

  const fetchAds = async () => {
    // In a real application, this would be an API call
    setIsLoading(true);
    // Simulating API call with setTimeout
    setTimeout(() => {
      const mockAds: Ad[] = [
        {
          id: "1",
          title: "Vintage Guitar",
          description: "Beautiful vintage guitar in excellent condition",
          price: 1200,
          status: "pending",
          featured: false,
          promoted: false,
          createdAt: "2023-05-01",
          userId: "user1",
        },
        {
          id: "2",
          title: "MacBook Pro 2021",
          description: "Like new MacBook Pro, barely used",
          price: 1800,
          status: "approved",
          featured: true,
          promoted: true,
          createdAt: "2023-05-02",
          userId: "user2",
        },
        {
          id: "3",
          title: "Mountain Bike",
          description: "High-end mountain bike, perfect for trails",
          price: 800,
          status: "rejected",
          featured: false,
          promoted: false,
          createdAt: "2023-05-03",
          userId: "user3",
        },
      ];
      setAds(mockAds);
      setIsLoading(false);
    }, 1000);
  };

  const handleApprove = (adId: string) => {
    setAds(
      ads.map((ad) => (ad.id === adId ? { ...ad, status: "approved" } : ad))
    );
  };

  const handleReject = (adId: string) => {
    setAds(
      ads.map((ad) => (ad.id === adId ? { ...ad, status: "rejected" } : ad))
    );
  };

  const handlePromote = (adId: string) => {
    setAds(ads.map((ad) => (ad.id === adId ? { ...ad, promoted: true } : ad)));
  };

  const handleFeature = (adId: string) => {
    setAds(ads.map((ad) => (ad.id === adId ? { ...ad, featured: true } : ad)));
  };

  const filteredAds = ads.filter(
    (ad) =>
      ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingAds = filteredAds.filter((ad) => ad.status === "pending");
  const approvedAds = filteredAds.filter((ad) => ad.status === "approved");
  const rejectedAds = filteredAds.filter((ad) => ad.status === "rejected");

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Pending Ads</h3>
              <p className="text-2xl font-bold text-blue-600">
                {pendingAds.length}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Approved Ads</h3>
              <p className="text-2xl font-bold text-green-600">
                {approvedAds.length}
              </p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <h3 className="font-semibold text-red-800">Rejected Ads</h3>
              <p className="text-2xl font-bold text-red-600">
                {rejectedAds.length}
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
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Ads</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <AdTable
              ads={filteredAds}
              onApprove={handleApprove}
              onReject={handleReject}
              onPromote={handlePromote}
              onFeature={handleFeature}
            />
          </TabsContent>
          <TabsContent value="pending">
            <AdTable
              ads={pendingAds}
              onApprove={handleApprove}
              onReject={handleReject}
              onPromote={handlePromote}
              onFeature={handleFeature}
            />
          </TabsContent>
          <TabsContent value="approved">
            <AdTable
              ads={approvedAds}
              onApprove={handleApprove}
              onReject={handleReject}
              onPromote={handlePromote}
              onFeature={handleFeature}
            />
          </TabsContent>
          <TabsContent value="rejected">
            <AdTable
              ads={rejectedAds}
              onApprove={handleApprove}
              onReject={handleReject}
              onPromote={handlePromote}
              onFeature={handleFeature}
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
}: {
  ads: Ad[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onPromote: (id: string) => void;
  onFeature: (id: string) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ads.map((ad) => (
          <TableRow key={ad.id}>
            <TableCell>{ad.title}</TableCell>
            <TableCell>${ad.price}</TableCell>
            <TableCell>
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
            </TableCell>
            <TableCell>{new Date(ad.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{ad.title}</DialogTitle>
                      <DialogDescription>{ad.description}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-bold">Price:</span>
                        <span className="col-span-3">${ad.price}</span>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-bold">Status:</span>
                        <span className="col-span-3">{ad.status}</span>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-bold">Featured:</span>
                        <span className="col-span-3">
                          {ad.featured ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <span className="font-bold">Promoted:</span>
                        <span className="col-span-3">
                          {ad.promoted ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => onApprove(ad.id)}>Approve</Button>
                      <Button
                        variant="destructive"
                        onClick={() => onReject(ad.id)}
                      >
                        Reject
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                {ad.status === "pending" && (
                  <>
                    <Button size="sm" onClick={() => onApprove(ad.id)}>
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onReject(ad.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                )}
                {ad.status === "approved" && !ad.promoted && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onPromote(ad.id)}
                  >
                    <Star className="w-4 h-4" />
                  </Button>
                )}
                {ad.status === "approved" && !ad.featured && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onFeature(ad.id)}
                  >
                    <Zap className="w-4 h-4" />
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
