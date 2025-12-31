import { NextResponse } from "next/server";
import { fetchPets } from "@/lib/external-data";

/**
 * API endpoint to fetch pets data
 * This demonstrates how external data can be loaded for Puck components
 */
export async function GET() {
  try {
    const pets = await fetchPets();
    return NextResponse.json(pets);
  } catch (error) {
    console.error("Error fetching pets:", error);
    return NextResponse.json(
      { error: "Failed to fetch pets" },
      { status: 500 }
    );
  }
}
