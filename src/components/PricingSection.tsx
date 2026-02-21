import type { Product } from "@/pages/Index";
import { motion } from "framer-motion";

interface PricingSectionProps {
  onPurchase: (product: Product) => void;
}

const plans = [
  {
    id: "windows",
    name: "Windows Utility",
    price: 9.99,
    license: "lifetime",
    billingNote: "One-time payment",
    highlight: false,
    perks: ["Lifetime license", "All future updates", "1 PC activation", "Email support"],
  },
  {
    id: "bundle",
    name: "Full Bundle",
    price: 19.99,
    license: "lifetime",
    billingNote: "Best value - Save $5",
    highlight: true,
    perks: ["Both utilities included", "Lifetime license", "All future updates", "2 PC activations each", "Priority support", "Early access to new tools"],
  },
  {
    id: "bios",
    name: "BIOS Utility",
    price: 14.99,
    license: "lifetime",
    billingNote: "One-time payment",
    highlight: false,
    perks: ["Lifetime license", "All future updates", "1 PC activation", "Priority support"],
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const PricingSection = ({ onPurchase }: PricingSectionProps) => (
  <section id="pricing" className="section-divider px-6 py-24">
    <div className="mx-auto max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-14 text-center"
      >
        <div className="tag mx-auto mb-4">Pricing</div>
        <h2 className="text-4xl font-black tracking-tighter md:text-5xl">Simple Pricing</h2>
        <p className="mt-3 text-sm text-muted-foreground">Pay once. Use forever. No subscriptions.</p>
      </motion.div>

      <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid items-start gap-5 md:grid-cols-3">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            variants={item}
            className={`utility-panel flex flex-col p-8 relative transition-all duration-500 ${
              plan.highlight ? "border-brand-glow/40 shadow-[0_0_40px_hsl(var(--brand-glow)/0.2)] md:scale-105" : "utility-panel-hover"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full border border-brand-glow/60 bg-brand-glow/20 px-4 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest">
                  Best Value
                </span>
              </div>
            )}
            <h3 className="mb-1 text-lg font-bold tracking-tight">{plan.name}</h3>
            <p className="mb-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{plan.billingNote}</p>
            <div className="mb-8">
              <span className="font-mono text-4xl font-black">${plan.price}</span>
              <span className="ml-1 font-mono text-sm text-muted-foreground">/ {plan.license}</span>
            </div>
            <ul className="mb-10 flex-1 space-y-3">
              {plan.perks.map((p) => (
                <li key={p} className="flex items-center gap-3 text-sm">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" className={plan.highlight ? "text-brand-glow" : "text-muted-foreground"}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-foreground/80">{p}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() =>
                onPurchase({
                  id: plan.id,
                  name: plan.name,
                  subtitle: plan.billingNote,
                  price: plan.price,
                  license: plan.license,
                })
              }
              className={`w-full rounded-lg py-3.5 font-mono text-xs uppercase tracking-wider transition-all duration-300 ${
                plan.highlight
                  ? "border border-brand-glow/60 bg-brand-glow/20 hover:bg-brand-glow/30"
                  : "border border-border/70 bg-muted/20 hover:bg-muted/35"
              }`}
            >
              Purchase
            </button>
          </motion.div>
        ))}
      </motion.div>

      <p className="mt-10 text-center font-mono text-xs text-muted-foreground opacity-60">
        Payments processed securely via PayPal. All licenses are non-transferable.
      </p>
    </div>
  </section>
);

export default PricingSection;
