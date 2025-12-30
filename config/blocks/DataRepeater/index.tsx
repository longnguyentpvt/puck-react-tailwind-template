import React from "react";
import { ComponentConfig } from "@measured/puck";
import type { Slot } from "@measured/puck";
import { Section } from "@/config/components/Section";
import { withLayout, WithLayout } from "@/config/components/Layout";
import { DataProvider } from "@/config/contexts/DataContext";

export type DataRepeaterProps = WithLayout<{
  pets: Array<{ pet: any; content: Slot }>;
  title?: string;
  layoutType?: "grid" | "flex" | "stack";
  columns?: number;
  gap?: string;
}>;

/**
 * DataRepeater component - A flexible wrapper for rendering external data with automatic data binding
 * 
 * This component works with external data from the pets API,
 * creating a slot for each data item. Uses React Context to provide data to child components.
 * 
 * How to use:
 * 1. Add DataRepeater component to your page
 * 2. Click "+ Add item" button in the "Pets" field
 * 3. For each item, click "External item" to select a pet
 * 4. Drag DataBoundText components into each pet's slot
 * 5. Configure DataBoundText to show specific fields (name, species, description, etc.)
 * 
 * Data Binding:
 * - Each slot is wrapped in a DataProvider that passes the pet data
 * - Child components can use DataBoundText to automatically display fields
 * - No manual copying of data required!
 */
const DataRepeaterInternal: ComponentConfig<DataRepeaterProps> = {
  fields: {
    title: {
      type: "text",
      label: "Title (optional)",
    },
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
      },
    },
    layoutType: {
      type: "select",
      label: "Layout Type",
      options: [
        { label: "Grid", value: "grid" },
        { label: "Flex Row", value: "flex" },
        { label: "Stack (Vertical)", value: "stack" },
      ],
    },
    columns: {
      type: "number",
      label: "Columns (Grid only)",
      min: 1,
      max: 6,
    },
    gap: {
      type: "select",
      label: "Gap",
      options: [
        { label: "None", value: "0" },
        { label: "Small", value: "4" },
        { label: "Medium", value: "6" },
        { label: "Large", value: "8" },
      ],
    },
  },
  defaultProps: {
    pets: [],
    title: "",
    layoutType: "grid",
    columns: 3,
    gap: "6",
    layout: {
      paddingTop: "8",
      paddingBottom: "8",
    },
  },
  render: ({ title, pets, layoutType, columns, gap }) => {
    const gapClass = `gap-${gap}`;
    
    // Use predefined column classes to ensure Tailwind includes them
    const columnClasses: Record<number, string> = {
      1: 'md:grid-cols-1',
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-3',
      4: 'md:grid-cols-4',
      5: 'md:grid-cols-5',
      6: 'md:grid-cols-6',
    };
    
    const containerClass = 
      layoutType === "grid" 
        ? `grid grid-cols-1 ${columnClasses[columns] || 'md:grid-cols-3'} ${gapClass}` 
        : layoutType === "flex"
        ? `flex flex-wrap ${gapClass}`
        : `flex flex-col ${gapClass}`;

    // Ensure pets is an array
    const petList = Array.isArray(pets) ? pets : [];

    return (
      <Section>
        <div className="w-full">
          {title && (
            <h2 className="text-3xl font-bold mb-6 text-center">
              {title}
            </h2>
          )}
          
          {petList && petList.length > 0 ? (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  🎯 {petList.length} pet{petList.length !== 1 ? 's' : ''} selected - Auto data binding enabled!
                </p>
                <p className="text-xs text-blue-600">
                  Drag <strong>DataBoundText</strong> components into each pet's slot below.
                  They will automatically display data from the pet (name, species, description, etc.)
                </p>
              </div>
              
              <div className={containerClass}>
                {petList.map((item: any, index: number) => {
                  const pet = item.pet;
                  const Content = item.content;
                  
                  return (
                    <div 
                      key={pet?.id || index}
                      className="border-2 border-dashed border-blue-200 rounded-lg p-4 bg-white hover:border-blue-400 transition-colors"
                    >
                      {/* Wrap slot content with DataProvider to pass pet data to children */}
                      <DataProvider data={pet} dataType="pet">
                        <div className="min-h-[120px] mb-3">
                          <Content />
                        </div>
                      </DataProvider>
                      
                      {/* Show pet data reference */}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <details className="text-xs">
                          <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2">
                            <span className="text-blue-600">📊</span>
                            <span className="font-semibold">{pet?.name || `Pet #${index + 1}`}</span>
                            {pet?.species && (
                              <span className="text-gray-500">({pet.species})</span>
                            )}
                          </summary>
                          <div className="mt-2 bg-gray-50 p-3 rounded">
                            <p className="font-medium text-gray-700 mb-1">Available data fields:</p>
                            <pre className="overflow-auto text-xs text-gray-600">
{JSON.stringify(pet, null, 2)}
                            </pre>
                            <p className="mt-2 text-green-700 font-medium text-xs">
                              ✨ New: Use DataBoundText component!
                            </p>
                            <p className="text-gray-600 text-xs mt-1">
                              Drag a <strong>DataBoundText</strong> component into the slot above, then set:
                              • Field Path: "name" (or "species", "description", "age", "breed")
                              • It will automatically show that field's value!
                            </p>
                          </div>
                        </details>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
              <div className="max-w-md mx-auto">
                <p className="text-4xl mb-4">🐾</p>
                <p className="text-lg font-medium text-gray-700 mb-2">No pets selected</p>
                <p className="text-sm text-gray-500 mb-4">
                  Click the "External item" button in the "Select Pets" field above to choose pets from the API
                </p>
                <div className="bg-white rounded-lg p-4 text-left text-xs text-gray-600 border border-gray-200">
                  <p className="font-medium mb-2">How to use DataRepeater with automatic data binding:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Click "+ Add item" button above</li>
                    <li>Click "External item" to select a pet</li>
                    <li>Drag <strong>DataBoundText</strong> components into the pet's slot</li>
                    <li>Set Field Path to "name", "species", "description", etc.</li>
                    <li>Data automatically displays - no manual entry needed!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>
    );
  },
};

export const DataRepeater = withLayout(DataRepeaterInternal);
