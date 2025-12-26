import React from "react";
import { ComponentConfig } from "@measured/puck";
import { Section } from "@/config/components/Section";
import { Heading as _Heading } from "@/components/Heading";
import { withLayout, WithLayout } from "@/config/components/Layout";
import classNames from "classnames";
import { Pet } from "@/lib/external-data";

export type PetListProps = WithLayout<{
  pets: Pet[];
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
      type: "external",
      label: "Pets",
      // Fetch pet data from the API endpoint
      fetchList: async ({ query }) => {
        try {
          // Use absolute URL for server-side rendering
          const baseUrl = typeof window !== 'undefined' 
            ? window.location.origin 
            : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
          
          const response = await fetch(`${baseUrl}/api/pets`);
          if (!response.ok) {
            throw new Error("Failed to fetch pets");
          }
          const pets = await response.json();
          
          // Filter by query if provided
          const filteredPets = query
            ? pets.filter((pet: Pet) => 
                pet.name.toLowerCase().includes(query.toLowerCase()) ||
                pet.species.toLowerCase().includes(query.toLowerCase())
              )
            : pets;
          
          return filteredPets.map((pet: Pet) => ({
            value: pet,
            label: `${pet.name} (${pet.species})`,
          }));
        } catch (error) {
          console.error("Error loading pets:", error);
          return [];
        }
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
            <_Heading size="xxl" rank="2" className="mb-8 text-center">
              {title}
            </_Heading>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets && pets.length > 0 ? (
              pets.map((pet) => (
                <div
                  key={pet.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <_Heading size="l" rank="3" className="mb-2">
                    {pet.name}
                  </_Heading>
                  
                  {showSpecies && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-3">
                      {pet.species}
                    </span>
                  )}
                  
                  <p className={classNames(
                    "text-gray-600 leading-relaxed",
                    showSpecies ? "mt-2" : ""
                  )}>
                    {pet.description}
                  </p>
                </div>
              ))
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
