import logoImg from "@/assets/ascend-logo.png";
import { useState } from "react";
import { useAuth } from "@/lib/supabase-auth";

const navLinks = [
  { label: "Products", href: "#products" },
  { label: "Pricing", href: "#pricing" },
  { label: "Safety", href: "#safety" },
  { label: "Terms", href: "#tos" },
];

interface NavbarProps {
  onAccountClick: () => void;
}

const Navbar = ({ onAccountClick }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border/40 bg-background/55 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5">
        <a href="#" className="flex items-center gap-2.5 group">
          <img
            src={logoImg}
            alt="Ascend logo"
            className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110"
          />
          <span className="font-mono text-xs font-bold tracking-widest text-foreground uppercase">
            ASCEND
          </span>
        </a>
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={onAccountClick}
            className="text-xs tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1.5"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
            </svg>
            {user ? "Account" : "Sign In"}
          </button>
          <a
            href="#pricing"
            className="rounded-lg border border-brand-glow/50 bg-brand-glow/20 px-5 py-2 font-mono text-[10px] uppercase tracking-wider text-foreground transition-all duration-200 hover:bg-brand-glow/30"
          >
            Buy Now
          </a>
        </div>
        <button
          className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setOpen(!open)}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-6 py-3.5 text-xs text-muted-foreground hover:text-foreground border-b border-border/20 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={() => { setOpen(false); onAccountClick(); }}
            className="block w-full text-left px-6 py-3.5 text-xs text-muted-foreground hover:text-foreground border-b border-border/20 transition-colors"
          >
            {user ? "Account" : "Sign In"}
          </button>
          <a
            href="#pricing"
            onClick={() => setOpen(false)}
            className="block px-6 py-3.5 text-xs bg-brand-glow/20 text-foreground font-mono tracking-wider uppercase"
          >
            Buy Now
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
