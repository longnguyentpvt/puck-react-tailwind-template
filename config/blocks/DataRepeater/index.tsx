import React from "react";
import { ComponentConfig } from "@measured/puck";
import type { Slot } from "@measured/puck";
import { DataProvider } from "@/config/contexts/DataContext";
import { Layout } from "@/config/components/Layout";
import { spacingOptions } from "@/config/options";

type LayoutFieldProps = {
  flex?: string;
  alignSelf?: string;
  paddingTop?: string;
  paddingBottom?: string;
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
};

export type DataRepeaterProps = {
  pets: Array<{ pet: any; content: Slot; layout?: LayoutFieldProps }>;
};

// Flex options for array item layout
const flexOptions = [
  { label: "flex-1 (grow/shrink equally)", value: "1" },
  { label: "flex-auto (grow/shrink with basis auto)", value: "auto" },
  { label: "flex-initial (no grow, can shrink)", value: "initial" },
  { label: "flex-none (no grow/shrink)", value: "none" },
  { label: "basis-full (100% width)", value: "full" },
  { label: "basis-1/2 (50% width)", value: "1/2" },
  { label: "basis-1/3 (33% width)", value: "1/3" },
  { label: "basis-2/3 (66% width)", value: "2/3" },
  { label: "basis-1/4 (25% width)", value: "1/4" },
  { label: "basis-3/4 (75% width)", value: "3/4" },
];

const alignSelfOptions = [
  { label: "Auto", value: "auto" },
  { label: "Start", value: "start" },
  { label: "Center", value: "center" },
  { label: "End", value: "end" },
  { label: "Stretch", value: "stretch" },
];

/**
 * DataRepeater component - A data handler that generates slots for external data
 * 
 * This component works with external data from the pets API,
 * creating a slot for each data item. Each slot has its own layout properties
 * so they can participate properly in parent Flex/Grid layouts.
 */
export const DataRepeater: ComponentConfig<DataRepeaterProps> = {
  inline: true,
  fields: {
    pets: {
      type: "array",
      label: "Pets",
      getItemSummary: (item: any) => item.pet?.name || "Pet",
      arrayFields: {
        pet: {
          type: "external",
          label: "Select Pet",
          fetchList: async ({ query, filters }) => {
            try {
              // Strategy 1: Try relative URL first (works in most cases)
              let response;
              let pets;
              
              try {
                console.log('[DataRepeater] Attempting relative URL fetch');
                response = await fetch('/api/pets');
                if (response.ok) {
                  pets = await response.json();
                  console.log('[DataRepeater] Successfully fetched via relative URL:', pets.length, 'pets');
                }
              } catch (relativeError) {
                console.log('[DataRepeater] Relative URL failed, trying absolute URL');
                
                // Strategy 2: Fall back to absolute URL
                const baseUrl = typeof window !== 'undefined' 
                  ? window.location.origin 
                  : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
                
                console.log('[DataRepeater] Fetching from absolute URL:', `${baseUrl}/api/pets`);
                response = await fetch(`${baseUrl}/api/pets`);
                
                if (!response.ok) {
                  throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                pets = await response.json();
                console.log('[DataRepeater] Successfully fetched via absolute URL:', pets.length, 'pets');
              }
              
              if (!pets || !Array.isArray(pets)) {
                console.error('[DataRepeater] Invalid response format');
                return [];
              }
              
              // Filter by search query if provided
              const filteredPets = query
                ? pets.filter((pet: any) => 
                    pet.name?.toLowerCase().includes(query.toLowerCase()) ||
                    pet.species?.toLowerCase().includes(query.toLowerCase())
                  )
                : pets;
              
              // Return in format expected by Puck's external field
              const result = filteredPets.map((pet: any) => ({
                value: pet,
                label: `${pet.name} (${pet.species})`,
              }));
              
              console.log('[DataRepeater] Returning', result.length, 'results');
              return result;
            } catch (error) {
              console.error("[DataRepeater] Error loading pets:", error);
              // Return empty array to prevent UI from breaking
              return [];
            }
          },
        },
        content: {
          type: "slot",
          label: "Content",
        },
        layout: {
          type: "object",
          label: "Layout",
          objectFields: {
            flex: {
              type: "select",
              label: "Flex",
              options: flexOptions,
            },
            alignSelf: {
              type: "select",
              label: "Align Self",
              options: alignSelfOptions,
            },
            paddingTop: {
              type: "select",
              label: "Padding Top",
              options: spacingOptions,
            },
            paddingBottom: {
              type: "select",
              label: "Padding Bottom",
              options: spacingOptions,
            },
            marginTop: {
              type: "select",
              label: "Margin Top",
              options: spacingOptions,
            },
            marginBottom: {
              type: "select",
              label: "Margin Bottom",
              options: spacingOptions,
            },
            marginLeft: {
              type: "select",
              label: "Margin Left",
              options: spacingOptions,
            },
            marginRight: {
              type: "select",
              label: "Margin Right",
              options: spacingOptions,
            },
          },
        },
      },
    },
  },
  defaultProps: {
    pets: [],
  },
  render: ({ pets, puck }) => {
    // Ensure pets is an array
    const petList = Array.isArray(pets) ? pets : [];
    const isEditing = puck?.isEditing === true;

    // When no pets are added, show a selectable placeholder in editor mode
    if (petList.length === 0) {
      return (
        <div 
          className={isEditing 
            ? "p-4 text-center text-gray-500 text-sm border border-dashed border-gray-300 rounded min-h-[60px] flex items-center justify-center"
            : "hidden"
          }
        >
          {isEditing && "Add pets to generate slots"}
        </div>
      );
    }

    // Each slot is wrapped in its own Layout component with flex properties
    // Using Fragment to avoid any wrapper that would break parent flex layout
    return (
      <>
        {petList.map((item: any, index: number) => {
          // External field stores the selected value directly in item.pet
          const pet = item.pet;
          const Content = item.content;
          // Default flex to "1" if not set, so slots are properly sized for dragging
          const itemLayout = { flex: "1", ...item.layout };
          
          return (
            <Layout 
              key={pet?.id || index} 
              layout={itemLayout}
            >
              <DataProvider data={pet} dataType="pet">
                {isEditing ? (
                  // In edit mode, wrap slot in a container with visual indicators
                  <div className="min-h-[100px] border border-dashed border-blue-200 rounded-lg bg-blue-50/30 p-2 hover:border-blue-400 hover:bg-blue-50/50 transition-all">
                    <div className="text-xs text-blue-500 mb-1 font-medium">
                      {pet?.name || `Pet ${index + 1}`} - Drop components here
                    </div>
                    <Content />
                  </div>
                ) : (
                  <Content />
                )}
              </DataProvider>
            </Layout>
          );
        })}
      </>
    );
  },
};
