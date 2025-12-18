import { ReactNode } from "react";
import { Section } from "../Section";

const FooterLink = ({ children, href }: { children: string; href: string }) => {
  const El = href ? "a" : "span";

  return (
    <li className="pb-2">
      <El
        href={href}
        className="no-underline text-sm text-gray-600"
      >
        {children}
      </El>
    </li>
  );
};

const FooterList = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  return (
    <div>
      <h3 className="m-0 p-0 font-semibold text-gray-700">
        {title}
      </h3>
      <ul className="list-none m-0 p-0 pt-3">
        {children}
      </ul>
    </div>
  );
};

const Footer = ({ children }: { children: ReactNode }) => {
  return (
    <footer className="bg-gray-50">
      <h2 className="invisible h-0 m-0">Footer</h2>
      <div className="p-8">
        <Section>
          <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] py-6">
            {children}
          </div>
        </Section>
      </div>
    </footer>
  );
};

Footer.List = FooterList;
Footer.Link = FooterLink;

export { Footer };
