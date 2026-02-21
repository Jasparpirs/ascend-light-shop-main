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
    billingNote: "Best value — Save $5",
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
  <section id="pricing" className="section-divider py-28 px-6">
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16 text-center"
      >
        <div className="tag mb-4 mx-auto">Pricing</div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Simple Pricing</h2>
        <p className="text-muted-foreground mt-3 text-sm">
          Pay once. Use forever. No subscriptions.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid md:grid-cols-3 gap-5 items-start"
      >
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            variants={item}
            className={`p-8 flex flex-col relative rounded-xl border transition-all duration-500 ${
              plan.highlight
                ? "bg-gradient-to-b from-card to-background border-brand-glow/20 shadow-[0_0_60px_hsl(210_100%_60%_/_0.08)] md:scale-105 md:-my-2"
                : "bg-card border-border/60 hover:border-border"
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="font-mono text-[10px] tracking-widest uppercase bg-brand-glow text-primary-foreground px-4 py-1.5 rounded-full font-semibold">
                  Best Value
                </span>
              </div>
            )}
            <h3 className="text-lg font-bold mb-1 tracking-tight">{plan.name}</h3>
            <p className="font-mono text-[10px] tracking-widest uppercase mb-6 text-muted-foreground">
              {plan.billingNote}
            </p>
            <div className="mb-8">
              <span className="text-4xl font-black font-mono">${plan.price}</span>
              <span className="text-sm ml-1 font-mono text-muted-foreground">/ {plan.license}</span>
            </div>
            <ul className="space-y-3 mb-10 flex-1">
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
              className={`w-full font-mono text-xs tracking-wider uppercase py-3.5 rounded-lg transition-all duration-300 ${
                plan.highlight
                  ? "bg-brand-glow text-primary-foreground hover:opacity-90 shadow-[0_0_20px_hsl(210_100%_60%_/_0.2)]"
                  : "bg-foreground text-primary-foreground hover:bg-foreground/90"
              }`}
            >
              Purchase
            </button>
          </motion.div>
        ))}
      </motion.div>

      <p className="text-muted-foreground text-xs font-mono mt-10 text-center opacity-60">
        Payments processed securely via PayPal. All licenses are non-transferable.
      </p>
    </div>
  </section>
);

export default PricingSection;
