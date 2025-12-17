import { CSSProperties, forwardRef, ReactNode } from "react";
import classNames from "classnames";

export type SectionProps = {
  className?: string;
  children: ReactNode;
  maxWidth?: string;
  style?: CSSProperties;
};

export const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ children, className, maxWidth = "1280px", style = {} }, ref) => {
    return (
      <div
        className={classNames(
          "[&:not(.Section_.Section)]:px-4 md:[&:not(.Section_.Section)]:px-6",
          className
        )}
        style={{
          ...style,
        }}
        ref={ref}
      >
        <div 
          className="mx-auto h-full w-full [.Section_.Section_&]:mx-0" 
          style={{ maxWidth }}
        >
          {children}
        </div>
      </div>
    );
  }
);
