"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoadingMessage() {
  const [showConnectionMessage, setShowConnectionMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConnectionMessage(true);
    }, 5000); // Show the connection message after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-center">Loading</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-center text-sm text-muted-foreground">
              Please wait while we fetch the results...
            </p>
            {showConnectionMessage && (
              <p
                className="text-center text-sm text-yellow-600 dark:text-yellow-400"
                role="alert"
              >
                Oops! Loading is taking longer than expected. Please check your
                internet connection.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
