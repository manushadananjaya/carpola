"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import districtsData from "@/data/sri-lanka-districts.json";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

type AlertType = "error" | "success" | null;

interface AlertProps {
  type: AlertType;
  title: string;
  message: string;
}

const CustomAlert: React.FC<AlertProps> = ({ type, title, message }) => {
  if (!type) return null;

  return (
    <Alert
      variant={type === "error" ? "destructive" : "default"}
      className="mb-4"
    >
      {type === "error" ? (
        <AlertCircle className="h-4 w-4" />
      ) : (
        <CheckCircle className="h-4 w-4" />
      )}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    district: "",
    city: "",
    password: "",
    confirmPassword: "",
    isOnboarded: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<AlertProps>({
    type: null,
    title: "",
    message: "",
  });
  const [isWaitingForVerification, setIsWaitingForVerification] =
    useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  type DistrictsData = {
    [key: string]: {
      cities: string[];
    };
  };

  const cities = formData.district
    ? (districtsData as DistrictsData)[formData.district]?.cities || []
    : [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert({ type: null, title: "", message: "" });

    if (formData.password !== formData.confirmPassword) {
      setAlert({
        type: "error",
        title: "Error",
        message: "Passwords do not match",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setAlert({
          type: "success",
          title: "Success",
          message:
            "Registration successful. Please check your email to verify your account.",
        });
        setIsWaitingForVerification(true); 
      } else {
        if (data.error === "User-already-exists") {
          setAlert({
            type: "error",
            title: "Error",
            message:
              "A user with this email already exists. Please sign in or use a different email.",
          });
        } else {
          throw new Error(data.message || "Registration failed");
        }
      }
    } catch (error) {
      setAlert({
        type: "error",
        title: "Error",
        message: error instanceof Error ? error.message : "Registration failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isWaitingForVerification) {
      intervalId = setInterval(async () => {
        try {
          const response = await fetch("/api/check-verification", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: formData.email }),
          });
          const data = await response.json();

          if (data.isVerified) {
            clearInterval(intervalId);
            router.push("/auth/signin");
          }
        } catch (error) {
          console.error("Verification check failed:", error);
        }
      }, 5000); 
    }

    return () => clearInterval(intervalId);
  }, [isWaitingForVerification, formData.email, router]);

  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Register
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CustomAlert {...alert} />
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
                  className="block w-full border border-gray-300 rounded-md p-2"
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
                  disabled={!formData.district}
                  className="block w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={8}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
