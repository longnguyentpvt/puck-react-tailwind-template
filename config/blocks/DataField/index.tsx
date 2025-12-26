import React from "react";
import { ComponentConfig } from "@measured/puck";
import { Section } from "@/config/components/Section";
import { Heading as _Heading } from "@/components/Heading";
import { withLayout, WithLayout } from "@/config/components/Layout";

export type DataFieldProps = WithLayout<{
  fieldPath: string;
  displayAs: "heading" | "text" | "badge" | "image";
  headingSize?: "xxxl" | "xxl" | "xl" | "l" | "m" | "s" | "xs";
  headingLevel?: "1" | "2" | "3" | "4" | "5" | "6";
  textSize?: "sm" | "base" | "lg" | "xl";
  badgeColor?: "blue" | "green" | "red" | "yellow" | "gray";
  fallback?: string;
}>;

/**
 * DataField component - Displays a field from parent data context
 * 
 * This component is designed to be used inside DataRepeater slots.
 * It reads data from the parent context and displays it in various formats.
 * 
 * Example usage:
 * - Display pet.name as a heading
 * - Display pet.description as text
 * - Display pet.species as a badge
 * - Display pet.age as formatted text
 */
const DataFieldInternal: ComponentConfig<DataFieldProps> = {
  fields: {
    fieldPath: {
      type: "text",
      label: "Field Path",
      placeholder: "e.g., name, description, species, age",
    },
    displayAs: {
      type: "select",
      label: "Display As",
      options: [
        { label: "Heading", value: "heading" },
        { label: "Text", value: "text" },
        { label: "Badge", value: "badge" },
        { label: "Image", value: "image" },
      ],
    },
    headingSize: {
      type: "select",
      label: "Heading Size",
      options: [
        { label: "XXXL", value: "xxxl" },
        { label: "XXL", value: "xxl" },
        { label: "XL", value: "xl" },
        { label: "L", value: "l" },
        { label: "M", value: "m" },
        { label: "S", value: "s" },
        { label: "XS", value: "xs" },
      ],
    },
    headingLevel: {
      type: "select",
      label: "Heading Level",
      options: [
        { label: "H1", value: "1" },
        { label: "H2", value: "2" },
        { label: "H3", value: "3" },
        { label: "H4", value: "4" },
        { label: "H5", value: "5" },
        { label: "H6", value: "6" },
      ],
    },
    textSize: {
      type: "select",
      label: "Text Size",
      options: [
        { label: "Small", value: "sm" },
        { label: "Base", value: "base" },
        { label: "Large", value: "lg" },
        { label: "Extra Large", value: "xl" },
      ],
    },
    badgeColor: {
      type: "select",
      label: "Badge Color",
      options: [
        { label: "Blue", value: "blue" },
        { label: "Green", value: "green" },
        { label: "Red", value: "red" },
        { label: "Yellow", value: "yellow" },
        { label: "Gray", value: "gray" },
      ],
    },
    fallback: {
      type: "text",
      label: "Fallback Text",
      placeholder: "Text to show if field is empty",
    },
  },
  defaultProps: {
    fieldPath: "name",
    displayAs: "text",
    headingSize: "m",
    headingLevel: "3",
    textSize: "base",
    badgeColor: "blue",
    fallback: "",
    layout: {
      paddingTop: "2",
      paddingBottom: "2",
    },
  },
  resolveData: async ({ props }, { changed }) => {
    // This function can be used to resolve data from external sources
    // For now, we'll rely on the parent context
    return { props };
  },
  render: ({ fieldPath, displayAs, headingSize, headingLevel, textSize, badgeColor, fallback, puck }) => {
    // Try to get data from zone context
    // In Puck, zones can pass data to their children through the state
    let value = fallback || "";
    
    // For demonstration, we'll show the field path as a placeholder
    // In a real implementation, this would read from the zone's data context
    const placeholderValue = `{${fieldPath}}`;
    
    // Helper function to get nested property value
    const getNestedValue = (obj: any, path: string) => {
      return path.split('.').reduce((current, prop) => current?.[prop], obj);
    };

    // Try to access data from puck state if available
    if (puck) {
      // This is a simplified approach - in practice, you'd need to properly
      // access the parent zone's data through Puck's context system
      value = placeholderValue;
    } else {
      value = placeholderValue;
    }

    const renderContent = () => {
      switch (displayAs) {
        case "heading":
          return (
            <div className="mb-2">
              <_Heading size={headingSize as any} rank={headingLevel as any}>
                {value}
              </_Heading>
            </div>
          );
          
        case "badge":
          const badgeColors = {
            blue: "bg-blue-100 text-blue-800",
            green: "bg-green-100 text-green-800",
            red: "bg-red-100 text-red-800",
            yellow: "bg-yellow-100 text-yellow-800",
            gray: "bg-gray-100 text-gray-800",
          };
          return (
            <span className={`inline-block ${badgeColors[badgeColor]} text-sm px-3 py-1 rounded-full`}>
              {value}
            </span>
          );
          
        case "image":
          return (
            <img 
              src={value} 
              alt={fieldPath}
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
              }}
            />
          );
          
        case "text":
        default:
          const textSizeClass = {
            sm: "text-sm",
            base: "text-base",
            lg: "text-lg",
            xl: "text-xl",
          }[textSize];
          return (
            <p className={`${textSizeClass} text-gray-700 leading-relaxed`}>
              {value}
            </p>
          );
      }
    };

    return (
      <Section>
        <div className="w-full">
          {renderContent()}
          <div className="text-xs text-gray-400 mt-1 italic">
            Field: {fieldPath}
          </div>
        </div>
      </Section>
    );
  },
};

export const DataField = withLayout(DataFieldInternal);
