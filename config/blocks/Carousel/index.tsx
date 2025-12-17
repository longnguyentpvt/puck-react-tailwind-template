"use client";

import React from "react";
import { ComponentConfig } from "@measured/puck";
import {
  Carousel as ShadcnCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { WithLayout, withLayout } from "../../components/Layout";

export type CarouselProps = WithLayout<{
  items: {
    imageUrl: string;
    alt: string;
    title?: string;
    description?: string;
  }[];
  showControls: boolean;
  orientation: "horizontal" | "vertical";
  itemsPerSlide: 1 | 2 | 3 | 4;
}>;

const CarouselInner: ComponentConfig<CarouselProps> = {
  label: "Carousel",
  fields: {
    items: {
      type: "array",
      getItemSummary: (item, i) => item.title || item.alt || `Slide #${i + 1}`,
      defaultItemProps: {
        imageUrl: "https://placehold.co/600x400",
        alt: "Slide",
        title: "",
        description: "",
      },
      arrayFields: {
        imageUrl: { 
          type: "text",
          label: "Image URL",
        },
        alt: { 
          type: "text",
          label: "Alt Text",
        },
        title: { 
          type: "text",
          label: "Title (optional)",
        },
        description: { 
          type: "textarea",
          label: "Description (optional)",
        },
      },
    },
    showControls: {
      type: "radio",
      label: "Show Navigation Controls",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    orientation: {
      type: "radio",
      label: "Orientation",
      options: [
        { label: "Horizontal", value: "horizontal" },
        { label: "Vertical", value: "vertical" },
      ],
    },
    itemsPerSlide: {
      type: "select",
      label: "Items Per Slide",
      options: [
        { label: "1", value: 1 },
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "4", value: 4 },
      ],
    },
  },
  defaultProps: {
    items: [
      {
        imageUrl: "https://placehold.co/800x400/3b82f6/white?text=Slide+1",
        alt: "Slide 1",
        title: "First Slide",
        description: "This is the first slide",
      },
      {
        imageUrl: "https://placehold.co/800x400/8b5cf6/white?text=Slide+2",
        alt: "Slide 2",
        title: "Second Slide",
        description: "This is the second slide",
      },
      {
        imageUrl: "https://placehold.co/800x400/ec4899/white?text=Slide+3",
        alt: "Slide 3",
        title: "Third Slide",
        description: "This is the third slide",
      },
    ],
    showControls: true,
    orientation: "horizontal",
    itemsPerSlide: 1,
  },
  render: ({ items, showControls, orientation, itemsPerSlide }) => {
    const basisClass = {
      1: "md:basis-full",
      2: "md:basis-1/2",
      3: "md:basis-1/3",
      4: "md:basis-1/4",
    }[itemsPerSlide];

    return (
      <div className="w-full max-w-5xl mx-auto px-4 md:px-12">
        <ShadcnCarousel
          opts={{
            align: "start",
            loop: true,
          }}
          orientation={orientation}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {items.map((item, index) => (
              <CarouselItem key={index} className={`pl-2 md:pl-4 ${basisClass}`}>
                <div className="relative rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={item.imageUrl}
                    alt={item.alt}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                  {(item.title || item.description) && (
                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-4 md:p-6 text-white">
                      {item.title && (
                        <h3 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">{item.title}</h3>
                      )}
                      {item.description && (
                        <p className="text-xs md:text-sm opacity-90">{item.description}</p>
                      )}
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {showControls && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </ShadcnCarousel>
      </div>
    );
  },
};

export const Carousel = withLayout(CarouselInner);
