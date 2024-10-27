// app/search/page.tsx

import SearchResults from "./components/SearchResults";
import { Navbar } from "@/components/Navbar";
import { Suspense } from "react";

export default function SearchPage() {
        
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <div>
          <Navbar />
          <SearchResults />
        </div>
      </Suspense>
    );
  
}
