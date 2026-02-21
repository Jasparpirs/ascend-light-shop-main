import logoImg from "@/assets/ascend-logo.png";

const Footer = () => (
  <footer className="section-divider px-6 py-14">
    <div className="mx-auto max-w-6xl">
      <div className="utility-panel flex flex-col items-start justify-between gap-8 p-6 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="Ascend" className="h-7 w-7 object-contain opacity-70" />
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest">ASCEND</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">Built for control.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          {["Products", "Pricing", "Safety", "Terms"].map((label) => (
            <a key={label} href={`#${label.toLowerCase()}`} className="text-xs text-muted-foreground transition-colors duration-200 hover:text-foreground">
              {label}
            </a>
          ))}
        </div>
        <p className="text-xs text-muted-foreground opacity-50">(c) {new Date().getFullYear()} Ascend Software</p>
      </div>
    </div>
  </footer>
);

export default Footer;
