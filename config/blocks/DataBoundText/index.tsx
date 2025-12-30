import React from "react";
import { ComponentConfig } from "@measured/puck";
import classNames from "classnames";
import { Section } from "@/config/components/Section";
import { WithLayout, withLayout } from "@/config/components/Layout";
import { WithColor, withColor, getColorClassName, getColorStyle } from "@/config/components/Color";
import { useDataField, useDataContext } from "@/config/contexts/DataContext";

export type DataBoundTextProps = WithLayout<WithColor<{
  fieldPath: string;
  align: "left" | "center" | "right";
  size?: "xs" | "s" | "m" | "l" | "xl";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold";
  defaultValue?: string;
  prefix?: string;
  suffix?: string;
}>>;

/**
 * DataBoundText Component
 * 
 * A component that can read and display data from a parent DataRepeater context.
 * This solves the manual configuration problem by automatically binding to data fields.
 * 
 * How to use:
 * 1. Drag this component into a DataRepeater slot
 * 2. Enter the field path (e.g., "name", "species", "description")
 * 3. The component will automatically display that field's value from the pet data
 * 
 * Features:
 * - Automatic data binding via React Context
 * - Supports nested fields with dot notation (e.g., "address.city")
 * - Configurable typography (size, weight, alignment)
 * - Optional prefix/suffix text
 * - Works with any data source (not just pets)
 */
const DataBoundTextInternal: ComponentConfig<DataBoundTextProps> = {
  fields: {
    fieldPath: {
      type: "text",
      label: "Field Path",
      placeholder: "e.g., name, species, description",
    },
    size: {
      type: "select",
      label: "Size",
      options: [
        { label: "XS", value: "xs" },
        { label: "S", value: "s" },
        { label: "M", value: "m" },
        { label: "L", value: "l" },
        { label: "XL", value: "xl" },
      ],
    },
    weight: {
      type: "select",
      label: "Weight",
      options: [
        { label: "Light", value: "light" },
        { label: "Normal", value: "normal" },
        { label: "Medium", value: "medium" },
        { label: "Semibold", value: "semibold" },
        { label: "Bold", value: "bold" },
      ],
    },
    align: {
      type: "radio",
      label: "Alignment",
      options: [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ],
    },
    defaultValue: {
      type: "text",
      label: "Default Value (if field not found)",
    },
    prefix: {
      type: "text",
      label: "Prefix (optional)",
      placeholder: "e.g., Name: ",
    },
    suffix: {
      type: "text",
      label: "Suffix (optional)",
      placeholder: "e.g., !",
    },
  },
  defaultProps: {
    fieldPath: "name",
    align: "left",
    size: "m",
    weight: "normal",
    defaultValue: "",
    prefix: "",
    suffix: "",
    layout: {
      paddingTop: "1",
      paddingBottom: "1",
    },
  },
  render: ({ 
    fieldPath, 
    align, 
    size, 
    weight, 
    defaultValue,
    prefix,
    suffix,
    colorType, 
    presetColor, 
    customColor 
  }) => {
    // Try to get data from context
    const dataContext = useDataContext();
    const fieldValue = useDataField(fieldPath, defaultValue);
    
    // Size classes
    const sizeClasses: Record<string, string> = {
      xs: 'text-xs',
      s: 'text-sm',
      m: 'text-base',
      l: 'text-lg',
      xl: 'text-xl',
    };
    
    // Weight classes
    const weightClasses: Record<string, string> = {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    };
    
    // Display text
    const displayText = `${prefix || ''}${fieldValue}${suffix || ''}`;
    
    // Show helpful message if no data context available
    if (!dataContext) {
      return (
        <Section>
          <div className="border-2 border-dashed border-yellow-300 bg-yellow-50 rounded p-3">
            <p className="text-xs text-yellow-800 font-medium">
              ⚠️ DataBoundText component
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              This component needs to be inside a DataRepeater slot to access data.
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Field: <code className="bg-yellow-100 px-1 rounded">{fieldPath}</code>
            </p>
          </div>
        </Section>
      );
    }
    
    // Show message if field not found
    if (fieldValue === defaultValue) {
      // Check if field exists using dot notation logic
      const fields = fieldPath.split('.');
      let exists = dataContext.data;
      for (const field of fields) {
        if (exists && typeof exists === 'object' && field in exists) {
          exists = exists[field];
        } else {
          exists = undefined;
          break;
        }
      }
      
      if (!exists && exists !== 0 && exists !== false) {
        return (
          <Section>
            <div className="border border-gray-300 bg-gray-50 rounded p-2">
              <p className="text-xs text-gray-600">
                Field "<code className="bg-gray-200 px-1 rounded">{fieldPath}</code>" not found
              </p>
              {defaultValue && (
                <p className="text-xs text-gray-500 mt-1">
                  Using default: "{defaultValue}"
                </p>
              )}
            </div>
          </Section>
        );
      }
    }
    
    return (
      <Section>
        <span
          className={classNames(
            "flex w-full leading-normal p-0",
            sizeClasses[size || 'm'],
            weightClasses[weight || 'normal'],
            getColorClassName(colorType, presetColor),
            align === "center" && "text-center justify-center",
            align === "right" && "text-right justify-end",
            align === "left" && "text-left justify-start"
          )}
          style={{ ...getColorStyle(colorType, customColor, presetColor) }}
        >
          {displayText}
        </span>
      </Section>
    );
  },
};

export const DataBoundText = withLayout(withColor(DataBoundTextInternal));
