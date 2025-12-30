import React from "react";
import { ComponentConfig } from "@measured/puck";
import type { Slot } from "@measured/puck";
import { Section } from "@/config/components/Section";
import { withLayout, WithLayout } from "@/config/components/Layout";
import { DataProvider } from "@/config/contexts/DataContext";

export type DataRepeaterProps = WithLayout<{
  pets: Array<{ pet: any; content: Slot }>;
  title?: string;
  puck?: { isEditing?: boolean }; // Internal prop from Puck to detect edit mode
}>;

/**
 * DataRepeater component - A flexible wrapper for rendering external data with automatic data binding
 * 
 * This component works with external data from the pets API,
 * creating a slot for each data item. Uses React Context to provide data to child components.
 * 
 * How to use:
 * 1. Add a Grid or Flex component to your page (for layout control)
 * 2. Drag DataRepeater into the Grid/Flex slot
 * 3. In DataRepeater, click "+ Add item" button in the "Pets" field
 * 4. For each item, click "External item" to select a pet
 * 5. Drag Heading or Text components into each pet's slot
 * 6. Use template syntax like "{{name}}" or "Pet: {{name}}" in the text field
 * 7. Or drag DataBoundText components to show specific fields
 * 
 * Data Binding:
 * - Each slot is wrapped in a DataProvider that passes the pet data
 * - Child components can use template syntax {{fieldPath}} in Heading/Text
 * - Or use DataBoundText to select fields via UI
 * - No manual copying of data required!
 * 
 * Layout Control:
 * - DataRepeater focuses on data generation and slot creation
 * - Place DataRepeater inside Grid or Flex components for layout control
 * - This separation provides better flexibility and reusability
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
  },
  defaultProps: {
    pets: [],
    title: "",
    layout: {
      paddingTop: "8",
      paddingBottom: "8",
    },
  },
  render: ({ title, pets, puck }) => {
    // Detect if we're in edit mode (Puck editor) or published view
    // In published view, we hide the instruction box, borders, and data summary
    // Use ?? true as default so it shows in editor when puck prop is undefined
    const isEditing = puck?.isEditing ?? true;
    
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
              {/* Only show instruction box in edit mode */}
              {isEditing && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 font-medium mb-2">
                    🎯 {petList.length} pet{petList.length !== 1 ? 's' : ''} selected - Auto data binding enabled!
                  </p>
                  <p className="text-xs text-blue-600">
                    Drag <strong>Heading</strong> or <strong>Text</strong> components and use template syntax like <code>{`"{{name}}"`}</code> or <code>{`"Pet: {{name}}"`}</code>.
                    Or use <strong>DataBoundText</strong> components to select fields via UI.
                  </p>
                  <p className="text-xs text-purple-600 mt-2">
                    💡 <strong>Tip:</strong> Place this DataRepeater inside a <strong>Grid</strong> or <strong>Flex</strong> component to control the layout!
                  </p>
                </div>
              )}
              
              <div className="space-y-6">
                {petList.map((item: any, index: number) => {
                  const pet = item.pet;
                  const Content = item.content;
                  
                  return (
                    <div 
                      key={pet?.id || index}
                      className={isEditing 
                        ? "border-2 border-dashed border-blue-200 rounded-lg p-4 bg-white hover:border-blue-400 transition-colors"
                        : ""
                      }
                    >
                      {/* Wrap slot content with DataProvider to pass pet data to children */}
                      <DataProvider data={pet} dataType="pet">
                        <div className={isEditing ? "min-h-[120px] mb-3" : ""}>
                          <Content />
                        </div>
                      </DataProvider>
                      
                      {/* Only show data summary in edit mode */}
                      {isEditing && (
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
                                ✨ Template Syntax (Recommended):
                              </p>
                              <p className="text-gray-600 text-xs mt-1">
                                Drag <strong>Heading</strong> or <strong>Text</strong> component, then use:
                                • <code>{`"{{name}}"`}</code> → Shows pet name
                                • <code>{`"Pet: {{name}}"`}</code> → Mix static & dynamic text
                                • <code>{`"{{species}}: {{name}}"`}</code> → Multiple fields
                              </p>
                              <p className="mt-2 text-blue-700 font-medium text-xs">
                                Or use DataBoundText:
                              </p>
                              <p className="text-gray-600 text-xs mt-1">
                                Drag a <strong>DataBoundText</strong> component and set:
                                • Field Path: "name" (or "species", "description", "age", "breed")
                              </p>
                            </div>
                          </details>
                        </div>
                      )}
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
                {isEditing && (
                  <>
                    <p className="text-sm text-gray-500 mb-4">
                      Click the "+ Add item" button in the "Pets" field above to add pets from the API
                    </p>
                    <div className="bg-white rounded-lg p-4 text-left text-xs text-gray-600 border border-gray-200">
                      <p className="font-medium mb-2">How to use DataRepeater with automatic data binding:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        <li>Place DataRepeater inside a <strong>Grid</strong> or <strong>Flex</strong> component</li>
                        <li>Click "+ Add item" button above</li>
                        <li>Click "External item" to select a pet</li>
                        <li>Drag <strong>Heading</strong> or <strong>Text</strong> into the slot</li>
                        <li>Use template syntax: <code>{`"{{name}}"`}</code>, <code>{`"Pet: {{name}}"`}</code></li>
                        <li>Or use <strong>DataBoundText</strong> with Field Path</li>
                      </ol>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </Section>
    );
  },
};

export const DataRepeater = withLayout(DataRepeaterInternal);
