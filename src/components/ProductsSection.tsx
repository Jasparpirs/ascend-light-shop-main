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
  <section id="products" className="section-divider py-28 px-6">
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <div className="tag mb-4">Products</div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Our Tools</h2>
        <p className="text-muted-foreground mt-3 text-sm max-w-md">
          Two precision tools. One goal — total system control.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-5"
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            variants={item}
            className="bg-card border border-border/60 rounded-xl p-8 md:p-10 flex flex-col group hover:border-border hover:shadow-[0_0_60px_hsl(210_100%_60%_/_0.04)] transition-all duration-500"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center">
                {product.icon}
              </div>
              <div className="tag">{product.tag}</div>
            </div>
            <h3 className="text-xl font-bold mb-1 tracking-tight">{product.name}</h3>
            <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase mb-5">
              {product.subtitle}
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              {product.description}
            </p>
            <ul className="space-y-2.5 mb-10 flex-1">
              {product.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className="text-muted-foreground flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-foreground/80">{f}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/40">
              <div>
                <span className="text-2xl font-bold font-mono">${product.price}</span>
                <span className="text-muted-foreground text-xs ml-2 font-mono">/ {product.license}</span>
              </div>
              <button
                onClick={() => onPurchase(product)}
                className="font-mono text-xs tracking-wider uppercase bg-foreground text-primary-foreground px-6 py-2.5 rounded-lg hover:bg-foreground/90 transition-all duration-300 hover:shadow-[0_0_20px_hsl(210_100%_60%_/_0.1)]"
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
