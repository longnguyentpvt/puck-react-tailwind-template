"use client";

import React from "react";
import { ComponentConfig } from "@measured/puck";
import type { Slot } from "@measured/puck";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel as ShadcnCarousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { WithLayout, withLayout } from "@/config/components/Layout";

export type CarouselProps = WithLayout<{
  slides: Array<{
    content: Slot;
  }>;
  showControls: boolean;
  navigationPosition: "overlay" | "outside";
  orientation: "horizontal" | "vertical";
  itemsPerSlide: 1 | 2 | 3 | 4;
  fullWidth: boolean;
  autoplay: boolean;
  autoplayInterval: string;
}>;

const CarouselInner: ComponentConfig<CarouselProps> = {
  label: "Carousel",
  fields: {
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
    slides: {
      type: "array",
      label: "Slides",
      arrayFields: {
        content: {
          type: "slot",
          label: "Content",
        },
      },
      getItemSummary: (item, index) => `Slide ${index + 1}`,
    },
    fullWidth: {
      type: "radio",
      label: "Width",
      options: [
        { label: "Full Width", value: true },
        { label: "Contained", value: false },
      ],
    },
    showControls: {
      type: "radio",
      label: "Show Navigation Controls",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    navigationPosition: {
      type: "radio",
      label: "Navigation Position",
      options: [
        { label: "Overlay", value: "overlay" },
        { label: "Outside", value: "outside" },
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
    autoplay: {
      type: "radio",
      label: "Autoplay",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    autoplayInterval: {
      type: "text",
      label: "Autoplay Interval (seconds)",
    },
  },
  defaultProps: {
    slides: [{ content: [] }],
    showControls: true,
    navigationPosition: "overlay",
    orientation: "horizontal",
    itemsPerSlide: 1,
    fullWidth: false,
    autoplay: false,
    autoplayInterval: "3",
  },
  render: ({ slides, showControls, navigationPosition, orientation, itemsPerSlide, fullWidth, autoplay, autoplayInterval }) => {
    const basisClass = {
      1: "basis-full",
      2: "basis-1/2",
      3: "basis-1/3",
      4: "basis-1/4",
    }[itemsPerSlide];

    // Group slides based on itemsPerSlide
    const groupedSlides = [];
    for (let i = 0; i < slides.length; i += itemsPerSlide) {
      groupedSlides.push(slides.slice(i, i + itemsPerSlide));
    }

    const plugins = autoplay
      ? [
          Autoplay({
            delay: (parseInt(autoplayInterval) || 3) * 1000,
            stopOnInteraction: true,
          }),
        ]
      : [];

    const containerClass = fullWidth 
      ? (navigationPosition === "outside" ? "px-12" : "")
      : "max-w-5xl mx-auto px-4 md:px-12";

    const navButtonClass = fullWidth && navigationPosition === "overlay" 
      ? { prev: "left-4", next: "right-4" }
      : { prev: "", next: "" };

    return (
      <div className={`w-full ${containerClass}`}>
        <ShadcnCarousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={plugins}
          orientation={orientation}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {groupedSlides.map((group, groupIndex) => (
              <CarouselItem key={groupIndex} className="pl-2 md:pl-4">
                <div className={`flex ${orientation === "horizontal" ? "flex-row" : "flex-col"} gap-4 w-full`}>
                  {group.map((slide, slideIndex) => {
                    const Content = slide.content;
                    return (
                      <div key={slideIndex} className={`${basisClass} min-h-50`}>
                        <Content />
                      </div>
                    );
                  })}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {showControls && (
            <>
              <CarouselPrevious className={navButtonClass.prev} />
              <CarouselNext className={navButtonClass.next} />
            </>
          )}
        </ShadcnCarousel>
      </div>
    );
  },
};

export const Carousel = withLayout(CarouselInner);
