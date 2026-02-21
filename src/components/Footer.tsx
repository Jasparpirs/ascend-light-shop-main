import logoImg from "@/assets/ascend-logo.png";

const Footer = () => (
  <footer className="section-divider py-16 px-6">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="Ascend" className="w-7 h-7 object-contain opacity-50" />
          <div>
            <p className="font-mono text-xs font-bold tracking-widest uppercase">ASCEND</p>
            <p className="text-muted-foreground text-[10px] mt-0.5">Built for control.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          {["Products", "Pricing", "Safety", "Terms"].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </div>
        <p className="text-muted-foreground text-xs opacity-50">
          © {new Date().getFullYear()} Ascend Software
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
