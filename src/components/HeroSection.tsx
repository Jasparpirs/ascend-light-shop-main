import { motion } from "framer-motion";

const navItems = ["Home", "Backups", "Quick Fixes", "Debloat", "Hardware", "Network"];
const quickstartItems = ["Create initial backup", "Apply performance preset", "Run cleanup routine", "Enable game profile"];

const HeroSection = () => (
  <section className="relative px-4 pb-8 pt-20 sm:px-6">
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="utility-shell mx-auto max-w-7xl overflow-hidden rounded-3xl"
    >
      <div className="flex h-9 items-center justify-center border-b border-border/50 bg-black/20 px-4">
        <span className="font-mono text-[11px] tracking-wider text-muted-foreground">Ascend Utility</span>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="utility-panel p-3">
          <div className="mb-3 rounded-xl border border-border/60 bg-muted/30 p-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">General</p>
          </div>
          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <div
                key={item}
                className={`rounded-lg border px-3 py-2 text-sm ${
                  index === 0
                    ? "border-brand-glow/50 bg-brand-glow/15 text-foreground"
                    : "border-border/50 bg-muted/20 text-muted-foreground"
                }`}
              >
                {item}
              </div>
            ))}
          </nav>
          <div className="mt-4 rounded-xl border border-border/60 bg-muted/20 p-3">
            <p className="text-sm font-semibold">Ascend License</p>
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Premium</p>
          </div>
        </aside>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold text-glow">System Overview</h1>
            <a
              href="#pricing"
              className="rounded-lg border border-border/70 bg-muted/30 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-foreground transition-colors hover:bg-muted/50"
            >
              Create Backup
            </a>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-4">
              <div className="utility-panel p-5">
                <p className="text-sm text-muted-foreground">Backups</p>
                <p className="mt-1 text-4xl font-semibold">4</p>
                <p className="text-sm text-muted-foreground">Restore point sets available</p>
              </div>
              <div className="utility-panel p-5">
                <p className="text-sm text-muted-foreground">Active Tweaks</p>
                <p className="mt-1 text-4xl font-semibold">5</p>
                <p className="text-sm text-muted-foreground">Performance rules currently enabled</p>
              </div>
              <div className="utility-panel p-5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-semibold">System Load</p>
                  <span className="rounded-full border border-brand-glow/50 bg-brand-glow/20 px-2 py-1 font-mono text-[10px] uppercase tracking-widest">
                    CPU
                  </span>
                </div>
                <div className="relative h-44 overflow-hidden rounded-xl border border-border/50 bg-black/20 p-3">
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_95%,hsl(var(--border)/0.5)_96%),linear-gradient(90deg,transparent_95%,hsl(var(--border)/0.5)_96%)] bg-[size:100%_26px,52px_100%]" />
                  <svg viewBox="0 0 100 40" className="relative h-full w-full">
                    <path
                      d="M0 36 L8 10 L13 22 L18 14 L26 20 L36 26 L45 21 L54 30 L62 19 L68 31 L75 23 L83 27 L92 15 L100 22"
                      fill="none"
                      stroke="hsl(var(--brand-glow))"
                      strokeWidth="1.4"
                    />
                    <circle cx="100" cy="22" r="2.6" fill="hsl(var(--brand-glow))" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="utility-panel p-5">
                <p className="text-sm text-muted-foreground">Game Mode</p>
                <p className="mt-1 text-3xl font-semibold">Disabled</p>
                <p className="mb-4 text-sm text-muted-foreground">Latency and scheduler profile</p>
                <button className="rounded-lg border border-brand-glow/60 bg-brand-glow/20 px-3 py-2 font-mono text-[11px] uppercase tracking-wider">
                  Enable
                </button>
              </div>
              <div className="utility-panel p-5">
                <p className="mb-3 text-xl font-semibold">Quickstart</p>
                <div className="space-y-2">
                  {quickstartItems.map((item) => (
                    <div key={item} className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm text-foreground/90">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pb-1">
            <a
              href="#products"
              className="rounded-lg border border-brand-glow/50 bg-brand-glow/15 px-4 py-2 font-mono text-xs uppercase tracking-widest"
            >
              Explore Products
            </a>
            <a
              href="#safety"
              className="rounded-lg border border-border/70 bg-muted/20 px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
            >
              Safety Details
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  </section>
);

export default HeroSection;
