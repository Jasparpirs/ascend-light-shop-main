import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/supabase-auth";
import { motion } from "framer-motion";
import logoImg from "@/assets/ascend-logo.png";

const PayPalReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [licenseKey, setLicenseKey] = useState("");
  const [payerName, setPayerName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const capturePayment = async () => {
      const token = searchParams.get("token");
      const product_id = searchParams.get("product_id");
      const product_name = searchParams.get("product_name");
      const license_type = searchParams.get("license_type");
      const price = searchParams.get("price");
      const user_id = searchParams.get("user_id") || user?.id;

      if (!token || !product_id) {
        setError("Invalid payment session.");
        setStatus("error");
        return;
      }

      try {
        const { data, error: fnError } = await supabase.functions.invoke("capture-paypal-order", {
          body: {
            order_id: token,
            product_id,
            product_name,
            license_type,
            price,
            user_id: user_id || null,
          },
        });

        if (fnError || data?.error) {
          throw new Error(data?.error || fnError?.message || "Capture failed");
        }

        setLicenseKey(data.license_key);
        setPayerName(data.payer_name);
        setStatus("success");
      } catch (e: any) {
        setError(e.message);
        setStatus("error");
      }
    };

    capturePayment();
  }, [searchParams, user]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <img src={logoImg} alt="Ascend" className="w-12 h-12 mx-auto mb-4 opacity-60" />
          <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">Ascend Software</p>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {status === "processing" && (
            <div className="p-12 text-center space-y-4">
              <div className="w-10 h-10 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">Processing your payment...</p>
            </div>
          )}

          {status === "success" && (
            <div className="p-8 space-y-6">
              <div className="text-center space-y-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto"
                >
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-emerald-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h2 className="text-xl font-bold">Payment Successful</h2>
                <p className="text-sm text-muted-foreground">
                  Thank you{payerName ? `, ${payerName}` : ""}! Your purchase is complete.
                </p>
              </div>

              <div className="space-y-3">
                <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">Your License Key</p>
                <div className="flex items-center gap-2 bg-muted/40 border border-border rounded-md px-4 py-3">
                  <code className="font-mono text-xs tracking-wider text-foreground break-all flex-1">{licenseKey}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(licenseKey)}
                    className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 p-1"
                    title="Copy"
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                  </button>
                </div>
              </div>

              {!user && (
                <div className="bg-muted/20 border border-border/60 rounded-md p-4">
                  <p className="text-xs text-muted-foreground">
                    <span className="text-foreground font-medium">Tip:</span> Create an account to securely store your license key and access it anytime.
                  </p>
                </div>
              )}

              <button
                onClick={() => navigate("/")}
                className="w-full bg-foreground text-primary-foreground font-mono text-xs tracking-widest uppercase py-3 rounded-md hover:bg-foreground/90 transition-colors"
              >
                Return Home
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-destructive/10 border border-destructive/30 flex items-center justify-center mx-auto">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-destructive">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">Payment Failed</h2>
              <p className="text-sm text-muted-foreground">{error}</p>
              <button
                onClick={() => navigate("/")}
                className="w-full bg-foreground text-primary-foreground font-mono text-xs tracking-widest uppercase py-3 rounded-md hover:bg-foreground/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PayPalReturn;
