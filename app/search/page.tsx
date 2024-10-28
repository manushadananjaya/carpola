// app/search/page.tsx

import { Footer } from "@/components/Footer";
import SearchResults from "./components/SearchResults";
import { Navbar } from "@/components/Navbar";
import { Suspense } from "react";
import LoadingMessage from "@/components/ui/loading-massage";

export default function SearchPage() {
        
    return (
      <Suspense fallback={<div><LoadingMessage /></div>}>
        <div>
          <Navbar />
          <SearchResults />
          <Footer />
        </div>
      </Suspense>
    );
  
}
