import logoImg from "@/assets/ascend-logo.png";
import { motion } from "framer-motion";

interface HeroSectionProps {
  heroImg: string;
}

const HeroSection = ({ heroImg }: HeroSectionProps) => (
  <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
    {/* Background */}
    <div className="absolute inset-0 z-0">
      <img src={heroImg} alt="" className="w-full h-full object-cover opacity-15" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-[700px] h-[700px] rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, hsl(210 100% 60% / 0.3) 0%, transparent 70%)" }}
        />
      </div>
    </div>

    {/* Noise texture */}
    <div className="absolute inset-0 z-0 opacity-[0.015]" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
    }} />

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 text-center max-w-4xl mx-auto px-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex justify-center mb-10"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full blur-3xl opacity-20" style={{ background: "hsl(210 100% 60% / 0.4)" }} />
          <img
            src={logoImg}
            alt="Ascend"
            className="relative w-20 h-20 md:w-24 md:h-24 object-contain animate-float"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="tag mb-6">System Utilities · v2.0</div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 text-glow leading-[0.9]"
      >
        ASCEND
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-base md:text-lg text-muted-foreground max-w-md mx-auto mb-10 font-light leading-relaxed"
      >
        Professional-grade Windows & BIOS utilities built for power users who demand full system control.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <a
          href="#products"
          className="inline-flex items-center justify-center gap-2 bg-foreground text-primary-foreground font-mono text-xs tracking-wider uppercase px-8 py-3.5 rounded-lg hover:bg-foreground/90 transition-all duration-300 hover:shadow-[0_0_30px_hsl(210_100%_60%_/_0.15)]"
        >
          Explore Products
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
        <a
          href="#pricing"
          className="inline-flex items-center justify-center border border-border text-foreground font-mono text-xs tracking-wider uppercase px-8 py-3.5 rounded-lg hover:bg-accent hover:border-foreground/20 transition-all duration-300"
        >
          View Pricing
        </a>
      </motion.div>
    </motion.div>

    {/* Scroll indicator */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="absolute bottom-10 z-10 flex flex-col items-center gap-2 text-muted-foreground"
    >
      <span className="font-mono text-[10px] tracking-widest uppercase opacity-40">Scroll</span>
      <motion.svg
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="opacity-40"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </motion.svg>
    </motion.div>
  </section>
);

export default HeroSection;
