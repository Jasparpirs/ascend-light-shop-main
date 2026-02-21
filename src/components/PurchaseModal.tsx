import { useState } from "react";
import type { Product } from "@/pages/Index";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/supabase-auth";
import { motion, AnimatePresence } from "framer-motion";

interface PurchaseModalProps {
  product: Product;
  onClose: () => void;
  onShowAccount?: () => void;
}

const PurchaseModal = ({ product, onClose, onShowAccount }: PurchaseModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayPal = async () => {
    setLoading(true);
    setError("");

    try {
      const returnUrl = `${window.location.origin}/paypal-return`;
      const cancelUrl = window.location.origin;

      const { data, error: fnError } = await supabase.functions.invoke("create-paypal-order", {
        body: {
          product_id: product.id,
          product_name: product.name,
          license_type: product.license,
          price: product.price,
          return_url: returnUrl,
          cancel_url: cancelUrl,
          user_id: user?.id || null,
        },
      });

      if (fnError || data?.error) {
        throw new Error(data?.error || fnError?.message || "Failed to create order");
      }

      if (data.approve_url) {
        window.location.href = data.approve_url;
      } else {
        throw new Error("No PayPal approval URL returned");
      }
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-card border border-border rounded-lg w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div>
              <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">Checkout</p>
              <p className="font-bold text-sm mt-0.5">{product.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted/50"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6 space-y-5">
            {/* Order summary */}
            <div className="space-y-3 bg-muted/20 border border-border/60 rounded-md p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Product</span>
                <span className="font-medium">{product.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">License</span>
                <span className="font-medium capitalize">{product.license}</span>
              </div>
              <div className="border-t border-border/60 pt-3 flex justify-between">
                <span className="font-bold text-sm">Total</span>
                <span className="font-bold font-mono text-lg">${product.price}</span>
              </div>
            </div>

            {/* Auth status */}
            {user ? (
              <div className="flex items-center gap-3 text-sm bg-muted/20 border border-border/60 rounded-md p-3">
                <div className="w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center">
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-foreground">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Signed in as</p>
                  <p className="text-xs font-medium">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="bg-muted/20 border border-border/60 rounded-md p-3">
                <p className="text-xs text-muted-foreground">
                  <button
                    onClick={() => { onClose(); onShowAccount?.(); }}
                    className="text-foreground underline underline-offset-2 hover:no-underline"
                  >
                    Sign in
                  </button>
                  {" "}to automatically link this purchase to your account, or continue as guest.
                </p>
              </div>
            )}

            {error && (
              <p className="text-destructive text-xs font-mono bg-destructive/10 border border-destructive/20 rounded-md p-3">{error}</p>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-5 border-t border-border flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-border font-mono text-xs tracking-widest uppercase py-3 rounded-md hover:bg-muted/50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePayPal}
              disabled={loading}
              className="flex-1 bg-[#0070ba] text-white font-mono text-xs tracking-widest uppercase py-3 rounded-md hover:bg-[#005ea6] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.23A.772.772 0 0 1 5.705 1.6h6.317c2.1 0 3.573.484 4.373 1.44.364.437.6.918.707 1.432.113.54.114 1.185 0 1.968l-.01.06v.54l.418.236c.352.187.634.399.847.638.35.393.577.88.675 1.45.1.587.067 1.268-.1 2.024-.19.868-.503 1.622-.928 2.238-.39.565-.882 1.03-1.464 1.382-.552.334-1.2.58-1.927.728-.706.145-1.506.218-2.378.218h-.564a1.697 1.697 0 0 0-1.678 1.435l-.043.228-.716 4.536-.033.166a.107.107 0 0 1-.106.09H7.076z"/>
                  </svg>
                  Pay ${product.price}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PurchaseModal;
