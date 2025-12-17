import { ReactNode } from "react";
import classNames from "classnames";

export type HeadingProps = {
  children: ReactNode;
  rank?: "1" | "2" | "3" | "4" | "5" | "6";
  size?: "xxxxl" | "xxxl" | "xxl" | "xl" | "l" | "m" | "s" | "xs";
};

const sizeClasses = {
  xxxxl: "text-[64px] font-extrabold tracking-[0.08ch]",
  xxxl: "text-[48px] font-bold",
  xxl: "text-[40px] font-bold",
  xl: "text-[32px] font-bold",
  l: "text-[24px] font-bold",
  m: "text-[20px] font-bold",
  s: "text-[16px] font-bold",
  xs: "text-[14px] font-bold",
};

export const Heading = ({ children, rank, size = "m" }: HeadingProps) => {
  const Tag: any = rank ? `h${rank}` : "span";

  return (
    <Tag
      className={classNames(
        "block text-black m-0 [&_b]:font-bold",
        sizeClasses[size]
      )}
    >
      {children}
    </Tag>
  );
};
