"use client";

import { getProviders, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Icon, Loader2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FaGoogle } from "react-icons/fa6";



export default function SignInPage() {
  const router = useRouter();
  const [providers, setProviders] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const setupProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    setupProviders();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      console.log("res", res);

      if (res?.error) {
        setError(res.error);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log("Error signing in with email and password ", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!providers) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Sign In
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {providers.google && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => signIn(providers.google.id)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                <FaGoogle />
                Sign in with Google
              </Button>
            )}

            <Separator className="my-4" />

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {error && <p className="text-red-500 text-center">{error}</p>}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Sign in with Email and Password
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Not a member?{" "}
              <Link
                href="/auth/signup"
                className="text-primary hover:underline"
              >
                Register now
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
