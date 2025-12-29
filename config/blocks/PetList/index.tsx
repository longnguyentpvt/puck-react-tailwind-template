import React from "react";
import { ComponentConfig } from "@measured/puck";
import { Section } from "@/config/components/Section";
import { Heading as _Heading } from "@/components/Heading";
import { withLayout, WithLayout } from "@/config/components/Layout";
import { Pet } from "@/lib/external-data";

export type PetListProps = WithLayout<{
  pets: Array<{ pet: Pet }>;
  title?: string;
  showSpecies?: boolean;
}>;

/**
 * PetList component - Demonstrates loading and rendering external data
 * 
 * This component fetches pet data from an external source and renders it
 * using Heading components for pet names and Text for descriptions.
 */
const PetListInternal: ComponentConfig<PetListProps> = {
  fields: {
    title: {
      type: "text",
      label: "List Title",
    },
    showSpecies: {
      type: "radio",
      label: "Show Species",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    pets: {
      type: "array",
      label: "Pets",
      getItemSummary: (item: Pet) => item.name || "Pet",
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
                console.log('[PetList] Attempting relative URL fetch');
                response = await fetch('/api/pets');
                if (response.ok) {
                  pets = await response.json();
                  console.log('[PetList] Successfully fetched via relative URL:', pets.length, 'pets');
                }
              } catch (relativeError) {
                console.log('[PetList] Relative URL failed, trying absolute URL');
                
                // Strategy 2: Fall back to absolute URL
                const baseUrl = typeof window !== 'undefined' 
                  ? window.location.origin 
                  : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
                
                console.log('[PetList] Fetching from absolute URL:', `${baseUrl}/api/pets`);
                response = await fetch(`${baseUrl}/api/pets`);
                
                if (!response.ok) {
                  throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                pets = await response.json();
                console.log('[PetList] Successfully fetched via absolute URL:', pets.length, 'pets');
              }
              
              if (!pets || !Array.isArray(pets)) {
                console.error('[PetList] Invalid response format');
                return [];
              }
              
              // Filter by query if provided
              const filteredPets = query
                ? pets.filter((pet: Pet) => 
                    pet.name.toLowerCase().includes(query.toLowerCase()) ||
                    pet.species.toLowerCase().includes(query.toLowerCase())
                  )
                : pets;
              
              const result = filteredPets.map((pet: Pet) => ({
                value: pet,
                label: `${pet.name} (${pet.species})`,
              }));
              
              console.log('[PetList] Returning', result.length, 'results');
              return result;
            } catch (error) {
              console.error("[PetList] Error loading pets:", error);
              // Return empty array to prevent UI from breaking
              return [];
            }
          },
        },
      },
    },
  },
  defaultProps: {
    pets: [],
    title: "Our Pets",
    showSpecies: true,
    layout: {
      paddingTop: "8",
      paddingBottom: "8",
    },
  },
  render: ({ title, pets, showSpecies }) => {
    return (
      <Section>
        <div className="w-full">
          {title && (
            <div className="mb-8 text-center">
              <_Heading size="xxl" rank="2">
                {title}
              </_Heading>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets && pets.length > 0 ? (
              pets.map((item, index) => {
                const pet = item.pet;
                return (
                  <div
                    key={pet?.id || index}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="mb-2">
                      <_Heading size="l" rank="3">
                        {pet?.name || 'Unknown'}
                      </_Heading>
                    </div>
                    
                    {showSpecies && pet?.species && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-3">
                        {pet.species}
                      </span>
                    )}
                    
                    <p className="text-gray-600 leading-relaxed">
                      {pet?.description || ''}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No pets available
              </div>
            )}
          </div>
        </div>
      </Section>
    );
  },
};

export const PetList = withLayout(PetListInternal);
