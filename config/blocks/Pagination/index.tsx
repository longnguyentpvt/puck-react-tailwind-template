"use client";

import React from "react";
import { ComponentConfig } from "@measured/puck";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { withLayout, WithLayout } from "@/config/components/Layout";
import { useDataScope } from "@/lib/data-binding";
import { getPageRange } from "@/lib/data-binding/pagination-data-source";

export type PaginationProps = WithLayout<{
  // Pagination behavior
  mode: "client" | "server";
  siblingCount: number;
  showFirstLast: boolean;
  
  // Styling options
  align: "start" | "center" | "end";
  className?: string;
  
  // Labels for accessibility and customization
  previousLabel: string;
  nextLabel: string;
  firstLabel: string;
  lastLabel: string;
  
  // Button variants and sizes
  variant: "default" | "outline" | "ghost";
  size: "default" | "sm" | "lg" | "icon";
  
  // Disabled states
  disabledClassName?: string;
}>;

const PaginationInternal: ComponentConfig<PaginationProps> = {
  fields: {
    mode: {
      type: "radio",
      label: "Mode",
      options: [
        { label: "Server-side (URL-based)", value: "server" },
        { label: "Client-side (State-based)", value: "client" },
      ],
    },
    siblingCount: {
      type: "number",
      label: "Sibling Page Count",
      min: 0,
      max: 3,
    },
    showFirstLast: {
      type: "radio",
      label: "Show First/Last Buttons",
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
    },
    align: {
      type: "select",
      label: "Alignment",
      options: [
        { label: "Start", value: "start" },
        { label: "Center", value: "center" },
        { label: "End", value: "end" },
      ],
    },
    previousLabel: {
      type: "text",
      label: "Previous Button Label",
    },
    nextLabel: {
      type: "text",
      label: "Next Button Label",
    },
    firstLabel: {
      type: "text",
      label: "First Button Label",
    },
    lastLabel: {
      type: "text",
      label: "Last Button Label",
    },
    variant: {
      type: "select",
      label: "Button Variant",
      options: [
        { label: "Default", value: "default" },
        { label: "Outline", value: "outline" },
        { label: "Ghost", value: "ghost" },
      ],
    },
    size: {
      type: "select",
      label: "Button Size",
      options: [
        { label: "Default", value: "default" },
        { label: "Small", value: "sm" },
        { label: "Large", value: "lg" },
        { label: "Icon", value: "icon" },
      ],
    },
    className: {
      type: "text",
      label: "Custom CSS Classes",
    },
    disabledClassName: {
      type: "text",
      label: "Disabled State CSS Classes",
    },
  },
  defaultProps: {
    mode: "server",
    siblingCount: 1,
    showFirstLast: false,
    align: "center",
    previousLabel: "Previous",
    nextLabel: "Next",
    firstLabel: "First",
    lastLabel: "Last",
    variant: "default",
    size: "default",
    className: "",
    disabledClassName: "opacity-50 cursor-not-allowed",
  },
  render: ({
    mode,
    siblingCount,
    showFirstLast,
    align,
    previousLabel,
    nextLabel,
    firstLabel,
    lastLabel,
    variant,
    size,
    className,
    disabledClassName,
  }) => {
    const { scope } = useDataScope();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    // Extract pagination metadata from data scope
    // The data scope should contain pagination info from parent data binding
    const paginationData = scope.pagination as {
      currentPage?: number;
      totalPages?: number;
      hasNextPage?: boolean;
      hasPrevPage?: boolean;
    } | undefined;
    
    const currentPage = paginationData?.currentPage || 1;
    const totalPages = paginationData?.totalPages || 1;
    const hasNextPage = paginationData?.hasNextPage ?? currentPage < totalPages;
    const hasPrevPage = paginationData?.hasPrevPage ?? currentPage > 1;
    
    // Helper to create URL with updated page
    const createPageUrl = (page: number): string => {
      if (mode === "client") {
        // For client mode, just return # - parent can handle via context
        return "#";
      }
      
      // For server mode, update URL search params
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      return `${pathname}?${params.toString()}`;
    };
    
    // Handle page navigation
    const handlePageChange = (page: number) => {
      if (mode === "server") {
        router.push(createPageUrl(page));
      } else {
        // Client mode - trigger event that parent can listen to
        // This allows parent components to update their pagination state
        window.dispatchEvent(
          new CustomEvent("pagination:change", {
            detail: { page },
          })
        );
      }
    };
    
    // Get page numbers to display
    const pageRange = getPageRange(currentPage, totalPages, siblingCount);
    
    // Alignment classes
    const alignmentClass = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
    }[align];
    
    // If only one page, don't show pagination
    if (totalPages <= 1) {
      return null;
    }
    
    return (
      <ShadcnPagination className={`${alignmentClass} ${className}`}>
        <PaginationContent>
          {/* First button (optional) */}
          {showFirstLast && (
            <PaginationItem>
              <PaginationLink
                href={createPageUrl(1)}
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage !== 1) {
                    handlePageChange(1);
                  }
                }}
                className={currentPage === 1 ? disabledClassName : ""}
                aria-disabled={currentPage === 1}
              >
                {firstLabel}
              </PaginationLink>
            </PaginationItem>
          )}
          
          {/* Previous button */}
          <PaginationItem>
            <PaginationPrevious
              href={createPageUrl(Math.max(1, currentPage - 1))}
              onClick={(e) => {
                e.preventDefault();
                if (hasPrevPage) {
                  handlePageChange(currentPage - 1);
                }
              }}
              className={!hasPrevPage ? disabledClassName : ""}
              aria-disabled={!hasPrevPage}
            >
              {previousLabel}
            </PaginationPrevious>
          </PaginationItem>
          
          {/* Page numbers */}
          {pageRange.map((page, index) => (
            <PaginationItem key={`page-${index}`}>
              {page === null ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={createPageUrl(page)}
                  onClick={(e) => {
                    e.preventDefault();
                    if (page !== currentPage) {
                      handlePageChange(page);
                    }
                  }}
                  isActive={page === currentPage}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          
          {/* Next button */}
          <PaginationItem>
            <PaginationNext
              href={createPageUrl(Math.min(totalPages, currentPage + 1))}
              onClick={(e) => {
                e.preventDefault();
                if (hasNextPage) {
                  handlePageChange(currentPage + 1);
                }
              }}
              className={!hasNextPage ? disabledClassName : ""}
              aria-disabled={!hasNextPage}
            >
              {nextLabel}
            </PaginationNext>
          </PaginationItem>
          
          {/* Last button (optional) */}
          {showFirstLast && (
            <PaginationItem>
              <PaginationLink
                href={createPageUrl(totalPages)}
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage !== totalPages) {
                    handlePageChange(totalPages);
                  }
                }}
                className={currentPage === totalPages ? disabledClassName : ""}
                aria-disabled={currentPage === totalPages}
              >
                {lastLabel}
              </PaginationLink>
            </PaginationItem>
          )}
        </PaginationContent>
      </ShadcnPagination>
    );
  },
};

export const Pagination = withLayout(PaginationInternal);
