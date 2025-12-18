import { DefaultRootProps, RootConfig } from "@measured/puck";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { fontFamilyOptions } from "./components/Font";

export type RootProps = DefaultRootProps & {
  fontFamily?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
  // Dark mode colors
  darkPrimaryColor?: string;
  darkSecondaryColor?: string;
  darkAccentColor?: string;
  darkBackgroundColor?: string;
  darkTextColor?: string;
};

export const Root: RootConfig<{
  props: RootProps;
}> = {
  fields: {
    fontFamily: {
      type: "select",
      label: "Font Family",
      options: fontFamilyOptions,
    },
    primaryColor: {
      type: "text",
      label: "Primary Color (Light)",
    },
    secondaryColor: {
      type: "text",
      label: "Secondary Color (Light)",
    },
    accentColor: {
      type: "text",
      label: "Accent Color (Light)",
    },
    backgroundColor: {
      type: "text",
      label: "Background Color (Light)",
    },
    textColor: {
      type: "text",
      label: "Text Color (Light)",
    },
    darkPrimaryColor: {
      type: "text",
      label: "Primary Color (Dark)",
    },
    darkSecondaryColor: {
      type: "text",
      label: "Secondary Color (Dark)",
    },
    darkAccentColor: {
      type: "text",
      label: "Accent Color (Dark)",
    },
    darkBackgroundColor: {
      type: "text",
      label: "Background Color (Dark)",
    },
    darkTextColor: {
      type: "text",
      label: "Text Color (Dark)",
    },
  },
  defaultProps: {
    title: "My Page",
    fontFamily: "sans-serif",
    primaryColor: "#3b82f6",
    secondaryColor: "#8b5cf6",
    accentColor: "#f59e0b",
    backgroundColor: "#ffffff",
    textColor: "#000000",
    darkPrimaryColor: "#60a5fa",
    darkSecondaryColor: "#a78bfa",
    darkAccentColor: "#fbbf24",
    darkBackgroundColor: "#0f172a",
    darkTextColor: "#f8fafc",
  },
  render: ({ fontFamily, primaryColor, secondaryColor, accentColor, backgroundColor, textColor, darkPrimaryColor, darkSecondaryColor, darkAccentColor, darkBackgroundColor, darkTextColor, puck: { isEditing, renderDropZone: DropZone } }) => {
    // Map font family value to actual font name
    const fontFamilyMap: Record<string, string> = {
      'sans': 'system-ui, -apple-system, sans-serif',
      'serif': 'Georgia, serif',
      'mono': 'ui-monospace, monospace',
      'inter': 'Inter, sans-serif',
      'roboto': 'Roboto, sans-serif',
      'open-sans': '"Open Sans", sans-serif',
      'lato': 'Lato, sans-serif',
      'montserrat': 'Montserrat, sans-serif',
      'poppins': 'Poppins, sans-serif',
      'raleway': 'Raleway, sans-serif',
      'nunito': 'Nunito, sans-serif',
      'playfair-display': '"Playfair Display", serif',
      'merriweather': 'Merriweather, serif',
      'lora': 'Lora, serif',
      'pt-serif': '"PT Serif", serif',
      'bebas-neue': '"Bebas Neue", sans-serif',
      'oswald': 'Oswald, sans-serif',
      'archivo-black': '"Archivo Black", sans-serif',
    };
    
    const fontFamilyStyle = fontFamily ? fontFamilyMap[fontFamily] || fontFamilyMap['sans'] : fontFamilyMap['sans'];
    
    return (
      <>
        <style jsx>{`
          :root {
            --color-primary: ${primaryColor};
            --color-secondary: ${secondaryColor};
            --color-accent: ${accentColor};
            --color-background: ${backgroundColor};
            --color-text: ${textColor};
          }
          .dark {
            --color-primary: ${darkPrimaryColor};
            --color-secondary: ${darkSecondaryColor};
            --color-accent: ${darkAccentColor};
            --color-background: ${darkBackgroundColor};
            --color-text: ${darkTextColor};
          }
        `}</style>
        <div
          style={{ 
            display: "flex", 
            flexDirection: "column", 
            minHeight: "100vh",
            ['--font-family' as any]: fontFamilyStyle,
            fontFamily: 'var(--font-family)',
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-text)',
          }}
        >
        <Header editMode={isEditing} />
        <DropZone zone="default-zone" style={{ flexGrow: 1 }} />

        <Footer>
          <Footer.List title="Section">
            <Footer.Link href="#">Label</Footer.Link>
            <Footer.Link href="#">Label</Footer.Link>
            <Footer.Link href="#">Label</Footer.Link>
            <Footer.Link href="#">Label</Footer.Link>
          </Footer.List>
          <Footer.List title="Section">
            <Footer.Link href="#">Label</Footer.Link>
            <Footer.Link href="#">Label</Footer.Link>
            <Footer.Link href="#">Label</Footer.Link>
            <Footer.Link href="#">Label</Footer.Link>
          </Footer.List>
          <Footer.List title="Section">
            <Footer.Link href="#">Label</Footer.Link>
            <Footer.Link href="#">Label</Footer.Link>
            <Footer.Link href="#">Label</Footer.Link>
            <Footer.Link href="#">Label</Footer.Link>
          </Footer.List>
          <Footer.List title="Section">
            <Footer.Link href="#">Label</Footer.Link>
            <Footer.Link href="#">Label</Footer.Link>
            <Footer.Link href="#">Label</Footer.Link>
            <Footer.Link href="#">Label</Footer.Link>
          </Footer.List>
        </Footer>
        </div>
      </>
    );
  },
};

export default Root;
