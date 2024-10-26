// app/search/page.tsx

import SearchResults from "./components/SearchResults";
import { Navbar } from "@/components/Navbar";

export default function SearchPage() {
        
    return (
        <>
            <div>
                <Navbar />
                <SearchResults />
            </div>
        </>
    );
  
}
