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
  onImageClick?: (imageUrl: string) => void;
}

export function ImageCarousel({
  images,
  alt,
  onImageClick,
}: ImageCarouselProps) {
  return (
    <Carousel className="w-full max-w-[300px] sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
      <CarouselContent>
        {images.map((src, index) => (
          <CarouselItem key={index}>
            <Card className="border-none shadow-none">
              <CardContent className="flex aspect-square items-center justify-center p-0">
                <Image
                  src={src}
                  alt={`${alt} - Image ${index + 1}`}
                  width={800}
                  height={600}
                  className="object-cover w-full h-full rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => onImageClick && onImageClick(src)}
                />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}
