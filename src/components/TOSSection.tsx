import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
  {
    id: "license",
    title: "1. License Agreement",
    content: `By purchasing and downloading any Ascend utility, you are granted a non-exclusive, non-transferable, personal license to use the software on the number of devices specified at purchase. You may not redistribute, resell, reverse-engineer, or modify the software in any way. Violation of this agreement results in immediate termination of your license without refund.`,
  },
  {
    id: "refunds",
    title: "2. Refund Policy",
    content: `We offer a 7-day refund window from the date of purchase if the software does not perform as described and the issue cannot be resolved by our support team. Refund requests must be submitted via email with your order ID. Refunds are not available after a license key has been activated more than once.`,
  },
  {
    id: "liability",
    title: "3. Limitation of Liability",
    content: `Ascend utilities interact with low-level system components. While every precaution is taken to ensure safe operation, the user assumes full responsibility for any system modifications made using the software. We are not liable for data loss, hardware damage, or system failure resulting from misuse, incorrect operation, or hardware incompatibilities. Always maintain backups before using system-level tools.`,
  },
  {
    id: "updates",
    title: "4. Updates & Support",
    content: `Lifetime license holders receive all future updates at no additional cost. Support is provided via email. We aim to respond within 48 business hours. We reserve the right to discontinue support for older software versions after 24 months from their release date.`,
  },
  {
    id: "privacy",
    title: "5. Privacy",
    content: `We collect only the minimum information necessary to process your purchase (email address, transaction ID). This information is not sold or shared with third parties beyond payment processors. License validation is performed locally with only an anonymous token — no system data is transmitted to our servers.`,
  },
  {
    id: "changes",
    title: "6. Changes to Terms",
    content: `We reserve the right to update these terms at any time. Continued use of the software after changes constitutes acceptance of the new terms. Significant changes will be communicated via email to license holders.`,
  },
];

const TOSSection = () => {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="tos" className="section-divider py-28 px-6 bg-subtle">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="tag mb-4">Legal</div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Terms of Service</h2>
          <p className="text-muted-foreground mt-3 text-sm">Last updated: February 2026</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="rounded-xl overflow-hidden border border-border/50"
        >
          {sections.map((section) => (
            <div key={section.id} className="border-b border-border/40 last:border-b-0">
              <button
                onClick={() => setOpen(open === section.id ? null : section.id)}
                className="w-full flex items-center justify-between py-5 px-6 text-left group hover:bg-muted/20 transition-colors duration-200"
              >
                <span className="font-mono text-sm tracking-wide font-semibold">{section.title}</span>
                <motion.svg
                  animate={{ rotate: open === section.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                  className="flex-shrink-0 text-muted-foreground"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>
              <AnimatePresence>
                {open === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6 px-6">
                      <p className="text-muted-foreground text-sm leading-relaxed">{section.content}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TOSSection;
