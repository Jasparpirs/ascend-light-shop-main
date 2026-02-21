import type { Product } from "@/pages/Index";
import { motion } from "framer-motion";

interface ProductsSectionProps {
  onPurchase: (product: Product) => void;
}

const products = [
  {
    id: "windows",
    name: "Ascend Windows Utility",
    subtitle: "System Optimizer",
    tag: "Windows 10 / 11",
    price: 9.99,
    license: "lifetime",
    description:
      "A comprehensive Windows optimization suite. Clean junk files, manage startup programs, tweak system settings, and monitor performance.",
    features: [
      "One-click system cleanup",
      "Startup manager",
      "Registry optimizer",
      "Privacy settings control",
      "Real-time performance monitor",
      "Windows feature unlocker",
      "Driver backup & restore",
    ],
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-brand-glow">
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="3" width="8" height="8" rx="1" />
        <rect x="3" y="13" width="8" height="8" rx="1" />
        <rect x="13" y="13" width="8" height="8" rx="1" />
      </svg>
    ),
  },
  {
    id: "bios",
    name: "Ascend BIOS Utility",
    subtitle: "Firmware Control",
    tag: "UEFI / Legacy",
    price: 14.99,
    license: "lifetime",
    description:
      "Direct BIOS/UEFI access and management tool. Read, backup, and flash firmware safely with rollback protection.",
    features: [
      "BIOS/UEFI firmware backup",
      "Safe firmware flash",
      "Boot order manager",
      "Secure Boot toggle",
      "POST hardware diagnostics",
      "Fan curve configuration",
      "Advanced CPU/RAM settings",
    ],
    icon: (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-brand-glow">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18" />
      </svg>
    ),
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ProductsSection = ({ onPurchase }: ProductsSectionProps) => (
  <section id="products" className="section-divider px-6 py-24">
    <div className="mx-auto max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-14"
      >
        <div className="tag mb-4">Products</div>
        <h2 className="text-4xl font-black tracking-tighter md:text-5xl">Our Tools</h2>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          Two precision tools. One goal: total system control.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid gap-5 md:grid-cols-2"
      >
        {products.map((product) => (
          <motion.div key={product.id} variants={item} className="utility-panel utility-panel-hover flex flex-col p-8 md:p-10">
            <div className="mb-6 flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border/60 bg-muted/40">{product.icon}</div>
              <div className="tag">{product.tag}</div>
            </div>
            <h3 className="mb-1 text-xl font-bold tracking-tight">{product.name}</h3>
            <p className="mb-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{product.subtitle}</p>
            <p className="mb-8 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
            <ul className="mb-10 flex-1 space-y-2.5">
              {product.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="flex-shrink-0 text-muted-foreground">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-foreground/80">{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-6">
              <div>
                <span className="font-mono text-2xl font-bold">${product.price}</span>
                <span className="ml-2 font-mono text-xs text-muted-foreground">/ {product.license}</span>
              </div>
              <button
                onClick={() => onPurchase(product)}
                className="rounded-lg border border-brand-glow/50 bg-brand-glow/15 px-6 py-2.5 font-mono text-xs uppercase tracking-wider transition-all duration-300 hover:bg-brand-glow/30"
              >
                Buy Now
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default ProductsSection;
