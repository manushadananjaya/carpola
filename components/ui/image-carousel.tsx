// components/ui/image-carousel.tsx
"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  onImageClick?: (imageUrl: string) => void; // Make sure to include this prop in the interface
}

export function ImageCarousel({
  images,
  alt,
  onImageClick,
}: ImageCarouselProps) {
  return (
    <Carousel className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
      <CarouselContent>
        {images.map((src, index) => (
          <CarouselItem key={index}>
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-0">
                <Image
                  src={src}
                  alt={`${alt} - Image ${index + 1}`}
                  width={800}
                  height={600}
                  className="object-cover w-full h-full rounded-lg cursor-pointer" // Added cursor-pointer for better UX
                  onClick={() => onImageClick && onImageClick(src)} // Use the correct variable name for the image URL
                />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
