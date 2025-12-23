"use client";

import { useState } from "react";
import { Smartphone, Tablet, Monitor } from "lucide-react";

type Breakpoint = "base" | "md" | "lg";

type FieldConfig = {
  type: string;
  label: string;
  options?: Array<{ label: string; value: string }>;
  min?: number;
  max?: number;
};

type TabbedLayoutFieldProps = {
  field: {
    type: string;
    label: string;
    objectFields: Record<string, FieldConfig>;
  };
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  name: string;
};

const breakpoints = [
  { key: "base" as Breakpoint, label: "Mobile", icon: Smartphone, description: "Mobile (Base)" },
  { key: "md" as Breakpoint, label: "Tablet", icon: Tablet, description: "Tablet (768px+)" },
  { key: "lg" as Breakpoint, label: "Desktop", icon: Monitor, description: "Desktop (1024px+)" },
];

// Style constants for consistent UI
const FIELD_STYLES = {
  container: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: '#374151' },
  input: {
    width: '100%',
    padding: '8px 12px',
    fontSize: '13px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: 'white',
    color: '#111827',
  },
} as const;

export const TabbedLayoutField = ({ field, value = {}, onChange }: TabbedLayoutFieldProps) => {
  const [activeTab, setActiveTab] = useState<Breakpoint>("base");

  const handleFieldChange = (fieldName: string, fieldValue: any) => {
    const currentFieldValue = value?.[fieldName] || {};
    
    // Handle both simple values and responsive values
    const updatedFieldValue = typeof currentFieldValue === 'object' && !Array.isArray(currentFieldValue)
      ? { ...currentFieldValue, [activeTab]: fieldValue }
      : { [activeTab]: fieldValue };

    onChange({
      ...value,
      [fieldName]: updatedFieldValue,
    });
  };

  const getFieldValue = (fieldName: string): string | number => {
    const fieldValue = value?.[fieldName];
    
    // If it's already a responsive object, get the value for current breakpoint
    if (fieldValue && typeof fieldValue === 'object' && !Array.isArray(fieldValue)) {
      // Fallback to base value if current breakpoint is not set
      return fieldValue[activeTab] ?? fieldValue.base ?? "";
    }
    
    // Legacy: if it's a simple value and we're on base tab, show it
    if (activeTab === "base" && fieldValue !== undefined) {
      return fieldValue;
    }
    
    return "";
  };

  const renderField = (fieldName: string, fieldConfig: FieldConfig) => {
    const currentValue = getFieldValue(fieldName);

    if (fieldConfig.type === "select") {
      return (
        <div key={fieldName} style={FIELD_STYLES.container}>
          <label style={FIELD_STYLES.label}>
            {fieldConfig.label}
          </label>
          <select
            value={currentValue}
            onChange={(e) => handleFieldChange(fieldName, e.target.value || undefined)}
            style={FIELD_STYLES.input}
          >
            <option value="">-- Default --</option>
            {fieldConfig.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (fieldConfig.type === "number") {
      return (
        <div key={fieldName} style={FIELD_STYLES.container}>
          <label style={FIELD_STYLES.label}>
            {fieldConfig.label}
          </label>
          <input
            type="number"
            value={currentValue}
            min={fieldConfig.min}
            max={fieldConfig.max}
            onChange={(e) => handleFieldChange(fieldName, e.target.value ? Number(e.target.value) : undefined)}
            style={FIELD_STYLES.input}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'white' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
        {breakpoints.map(({ key, label, icon: Icon, description }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              backgroundColor: activeTab === key ? 'white' : 'transparent',
              borderBottom: activeTab === key ? '2px solid #2563eb' : '2px solid transparent',
              color: activeTab === key ? '#2563eb' : '#6b7280',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
            title={description}
          >
            <Icon style={{ width: '18px', height: '18px' }} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '16px', fontSize: '12px', color: '#6b7280', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
          <strong style={{ color: '#111827' }}>{breakpoints.find(b => b.key === activeTab)?.description}</strong>
        </div>
        
        {Object.entries(field.objectFields || {}).map(([fieldName, fieldConfig]: [string, any]) => 
          renderField(fieldName, fieldConfig)
        )}
      </div>
    </div>
  );
};
