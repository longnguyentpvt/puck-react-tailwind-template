/**
 * Mock external data source for pets
 * In a real application, this would fetch from an actual API or database
 */

export interface Pet {
  id: string;
  name: string;
  description: string;
  species: string;
}

// Mock pet data
const mockPets: Pet[] = [
  {
    id: "1",
    name: "Buddy",
    description: "A friendly golden retriever who loves to play fetch and go on long walks.",
    species: "Dog",
  },
  {
    id: "2",
    name: "Whiskers",
    description: "A curious tabby cat who enjoys napping in sunny spots and chasing toy mice.",
    species: "Cat",
  },
  {
    id: "3",
    name: "Max",
    description: "An energetic border collie with a talent for herding and agility training.",
    species: "Dog",
  },
  {
    id: "4",
    name: "Luna",
    description: "A gentle Persian cat with luxurious fur who prefers quiet companionship.",
    species: "Cat",
  },
  {
    id: "5",
    name: "Charlie",
    description: "A playful beagle with an excellent nose and a love for treats.",
    species: "Dog",
  },
];

/**
 * Fetch pets from external data source
 * Simulates an async API call
 */
export async function fetchPets(): Promise<Pet[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockPets;
}

/**
 * Fetch a single pet by ID
 */
export async function fetchPetById(id: string): Promise<Pet | undefined> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockPets.find((pet) => pet.id === id);
}
