"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import axios from "axios";
import { debounce } from "lodash";

export default function MainSearch() {
  const searchParams = useSearchParams();
  const [mainSearchTerm, setMainSearchTerm] = useState(
    searchParams.get("query") || ""
  );
  const [mainSearchSuggestions, setMainSearchSuggestions] = useState<string[]>(
    []
  );
  const [showMainSuggestions, setShowMainSuggestions] = useState(false);
  const router = useRouter();
  const mainSearchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMainSearchTerm(searchParams.get("query") || "");
  }, [searchParams]);

  const debouncedMainSearch = debounce(async (value: string) => {
    const trimmedValue = value.trim();

    if (trimmedValue.length < 2) {
      setMainSearchSuggestions([]);
      setShowMainSuggestions(false);
      return;
    }

    try {
      const response = await axios.get("/api/search-suggestions", {
        params: { query: trimmedValue },
      });

      const suggestions = response.data.map((item: any) => item.label || item);
      setMainSearchSuggestions(suggestions);
      setShowMainSuggestions(true);
    } catch (error) {
      console.error("Error fetching main search suggestions:", error);
    }
  }, 300);

  const handleMainSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(mainSearchTerm);
  };

  const handleMainSuggestionClick = (suggestion: string) => {
    setMainSearchTerm(suggestion);
    performSearch(suggestion);
  };

  const performSearch = (query: string) => {
    const currentSearchParams = new URLSearchParams(searchParams.toString());
    currentSearchParams.set("query", query);
    const category = currentSearchParams.get("category") || "all";
    const brand = currentSearchParams.get("brand") || "all-brands";
    const location = currentSearchParams.get("district")
      ? `${currentSearchParams.get("district")?.toLowerCase()}-in-${
          currentSearchParams.get("city")?.toLowerCase() || "sri-lanka"
        }`
      : "sri-lanka";

    router.push(
      `/search/${category}/${brand}/${location}?${currentSearchParams.toString()}`
    );
    setShowMainSuggestions(false);
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleMainSearch} className="flex gap-2">
        <div className="relative flex-grow">
          <Input
            placeholder="Search for any brand, model, or keyword"
            value={mainSearchTerm}
            onChange={(e) => {
              setMainSearchTerm(e.target.value);
              debouncedMainSearch(e.target.value);
            }}
            className="w-full"
            ref={mainSearchInputRef}
          />
          {showMainSuggestions && (
            <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
              {mainSearchSuggestions.length > 0 ? (
                mainSearchSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleMainSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">
                  No suggestions found
                </div>
              )}
            </div>
          )}
        </div>
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>
    </div>
  );
}
