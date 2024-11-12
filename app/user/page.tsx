"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle, Info } from "lucide-react";
import districtsData from "@/data/sri-lanka-districts.json";

type AlertType = "error" | "success" | "info" | null;

interface AlertProps {
  type: AlertType;
  title: string;
  message: string;
}

const CustomAlert: React.FC<AlertProps> = ({ type, title, message }) => {
  if (!type) return null;

  const Icon =
    type === "error" ? AlertCircle : type === "success" ? CheckCircle : Info;

  return (
    <Alert
      variant={
        type === "error"
          ? "destructive"
          : type === "info"
          ? "default"
          : "default"
      }
      className="mb-4"
    >
      <Icon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default function UserProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<AlertProps>({
    type: null,
    title: "",
    message: "",
  });

  const [formData, setFormData] = useState({
    username: session?.user?.username || "",
    email: session?.user?.email || "",
    phone: session?.user?.userPhone || "",
    district: session?.user?.district || "",
    city: session?.user?.city || "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated" && session?.user) {
      setFormData({
        username: session.user.username,
        email: session.user.email ?? "",
        phone: session.user.userPhone ?? "",
        district: session.user.district,
        city: session.user.city,
      });
    }
  }, [status, session, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert({ type: null, title: "", message: "" });

    try {
      const response = await fetch("/api/auth/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          userEmail: formData.email,
          userPhone: formData.phone,
          userDistrict: formData.district,
          userCity: formData.city,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAlert({
          type: "success",
          title: "Success",
          message: "Profile updated successfully.",
        });
        setIsEditing(false);
        router.refresh();
      } else {
        setAlert({
          type: "error",
          title: "Error",
          message:
            data.message || "Failed to update profile. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setAlert({
        type: "error",
        title: "Error",
        message: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            User Profile
          </CardTitle>
          <CardDescription className="text-center">
            {isEditing
              ? "Edit your profile information"
              : "View your profile information"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CustomAlert {...alert} />
          {isEditing && (
            <CustomAlert
              type="info"
              title="Email Cannot Be Changed"
              message="Your email address is verified and cannot be edited."
            />
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                maxLength={50}
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                maxLength={100}
                value={formData.email}
                onChange={handleChange}
                disabled={true}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                maxLength={15}
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="district">District</Label>
              <select
                id="district"
                name="district"
                required
                value={formData.district}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select District</option>
                {Object.keys(districtsData).map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <select
                id="city"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                disabled={!isEditing || !formData.district}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select City</option>
                {formData.district &&
                  (districtsData as any)[formData.district]?.cities.map(
                    (city: string) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    )
                  )}
              </select>
            </div>
            {isEditing && (
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
