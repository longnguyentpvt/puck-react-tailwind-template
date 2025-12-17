import classNames from "classnames";

const NavItem = ({ label, href }: { label: string; href: string }) => {
  const navPath =
    typeof window !== "undefined"
      ? window.location.pathname.replace("/edit", "") || "/"
      : "/";

  const isActive = navPath === (href.replace("/edit", "") || "/");

  const El = href ? "a" : "span";

  return (
    <El
      href={href || "/"}
      className={classNames(
        "no-underline",
        isActive 
          ? "text-gray-800 font-semibold" 
          : "text-gray-500 font-normal"
      )}
    >
      {label}
    </El>
  );
};

const Header = ({ editMode }: { editMode: boolean }) => (
  <div className="bg-white sticky top-0 z-2">
    <header className="flex items-center mx-auto max-w-7xl px-4 py-6 md:px-6">
      <div className="text-2xl font-extrabold tracking-[1.4px] opacity-80">LOGO</div>
      <nav className="flex gap-6 ml-auto lg:gap-8">
        <NavItem label="Home" href={`${editMode ? "" : "/"}`} />
        <NavItem label="Pricing" href={editMode ? "" : "/pricing"} />
        <NavItem label="About" href={editMode ? "" : "/about"} />
      </nav>
    </header>
  </div>
);

export { Header };
