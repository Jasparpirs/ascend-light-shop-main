import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/supabase-auth";
import { motion, AnimatePresence } from "framer-motion";

interface AccountModalProps {
  onClose: () => void;
}

type Tab = "login" | "signup";

const AccountModal = ({ onClose }: AccountModalProps) => {
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("login");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [licenses, setLicenses] = useState<any[]>([]);
  const [showDashboard, setShowDashboard] = useState(false);
  const normalizedEmail = form.email.trim().toLowerCase();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Valid email required";
    if (!form.password || form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    if (tab === "signup" && !form.name.trim())
      e.name = "Full name required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    setMessage("");
    setErrors({});
    const { error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: form.password,
    });
    if (error) {
      setErrors({ submit: error.message });
    } else {
      await claimLicenses();
      await loadLicenses();
      setShowDashboard(true);
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    setMessage("");
    setErrors({});
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: form.password,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) {
      setErrors({ submit: error.message });
    } else if (data.user) {
      if (data.session) {
        await claimLicenses(data.user.id);
        setMessage("Account created. You can sign in now.");
      } else {
        setMessage("Account created. Check your email to confirm, then sign in.");
      }
      setTab("login");
    }
    setLoading(false);
  };

  const claimLicenses = async (forcedUserId?: string) => {
    const userId = forcedUserId || user?.id;
    if (!userId) return;

    const { error } = await supabase
      .from("license_keys")
      .update({ user_id: userId })
      .eq("purchaser_email", normalizedEmail)
      .is("user_id", null);

    if (error) {
      setErrors({ submit: `Signed in, but failed to link licenses: ${error.message}` });
    }
  };

  const loadLicenses = async () => {
    const { data } = await supabase
      .from("license_keys")
      .select("*")
      .order("created_at", { ascending: false });
    setLicenses(data || []);
  };

  const handleViewDashboard = async () => {
    await loadLicenses();
    setShowDashboard(true);
  };

  const handleSignOut = async () => {
    await signOut();
    setShowDashboard(false);
    onClose();
  };

  const inputClass = "w-full bg-muted/40 border border-border rounded-md px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30 focus:border-foreground/50 transition-all";

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
              <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                {user ? "My Account" : tab === "login" ? "Sign In" : "Create Account"}
              </p>
              <p className="font-bold text-sm mt-0.5">Ascend Portal</p>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted/50">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-6 py-6">
            {/* Logged in — dashboard */}
            {user && showDashboard && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 p-4 bg-muted/20 border border-border/60 rounded-md">
                  <div className="w-9 h-9 rounded-full bg-foreground/10 flex items-center justify-center">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.email}</p>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Verified Member</p>
                  </div>
                </div>

                <div>
                  <p className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground mb-3">License Keys</p>
                  {licenses.length === 0 ? (
                    <div className="border border-border/60 rounded-md p-5 text-center">
                      <p className="text-muted-foreground text-sm">No licenses found.</p>
                      <p className="text-xs font-mono text-muted-foreground mt-1">Purchase a product to get started.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {licenses.map((lic) => (
                        <div key={lic.id} className="border border-border/60 rounded-md p-4 space-y-2">
                          <div className="flex justify-between items-start">
                            <p className="font-medium text-sm">{lic.product_name}</p>
                            <span className="font-mono text-[10px] bg-foreground text-primary-foreground px-2 py-0.5 rounded capitalize">
                              {lic.license_type}
                            </span>
                          </div>
                          <div className="bg-muted/30 rounded-md px-3 py-2 flex items-center justify-between gap-2">
                            <p className="font-mono text-xs text-muted-foreground tracking-wider truncate">{lic.license_key}</p>
                            <button
                              onClick={() => navigator.clipboard.writeText(lic.license_key)}
                              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                              title="Copy key"
                            >
                              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <rect x="9" y="9" width="13" height="13" rx="2" />
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                              </svg>
                            </button>
                          </div>
                          <p className="font-mono text-[10px] text-muted-foreground">
                            Purchased {new Date(lic.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {user && !showDashboard && (
              <div className="text-center space-y-4 py-2">
                <p className="text-sm text-muted-foreground">Signed in as <span className="text-foreground">{user.email}</span></p>
                <button
                  onClick={handleViewDashboard}
                  className="w-full bg-foreground text-primary-foreground font-mono text-xs tracking-widest uppercase py-3 rounded-md hover:bg-foreground/90 transition-colors"
                >
                  View My Licenses
                </button>
              </div>
            )}

            {!user && (
              <div className="space-y-5">
                <div className="flex rounded-md overflow-hidden border border-border">
                  {(["login", "signup"] as Tab[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => { setTab(t); setErrors({}); setMessage(""); }}
                      className={`flex-1 font-mono text-xs tracking-widest uppercase py-2.5 transition-all ${
                        tab === t ? "bg-foreground text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                      }`}
                    >
                      {t === "login" ? "Sign In" : "Register"}
                    </button>
                  ))}
                </div>

                {message && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-md p-3 text-xs text-emerald-400">{message}</div>
                )}

                <motion.div key={tab} initial={{ opacity: 0, x: tab === "login" ? -10 : 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  {tab === "signup" && (
                    <div>
                      <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground block mb-2">Full Name</label>
                      <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className={inputClass} />
                      {errors.name && <p className="text-destructive text-xs font-mono mt-1">{errors.name}</p>}
                    </div>
                  )}
                  <div>
                    <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground block mb-2">Email</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className={inputClass} />
                    {errors.email && <p className="text-destructive text-xs font-mono mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground block mb-2">Password</label>
                    <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" className={inputClass} />
                    {errors.password && <p className="text-destructive text-xs font-mono mt-1">{errors.password}</p>}
                  </div>
                </motion.div>

                {errors.submit && <p className="text-destructive text-xs font-mono bg-destructive/10 border border-destructive/20 rounded-md p-3">{errors.submit}</p>}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-5 border-t border-border flex gap-3">
            {user ? (
              <button onClick={handleSignOut} className="flex-1 border border-border font-mono text-xs tracking-widest uppercase py-3 rounded-md hover:bg-muted/50 transition-colors">
                Sign Out
              </button>
            ) : (
              <button
                onClick={tab === "login" ? handleLogin : handleSignup}
                disabled={loading}
                className="flex-1 bg-foreground text-primary-foreground font-mono text-xs tracking-widest uppercase py-3 rounded-md hover:bg-foreground/90 transition-colors disabled:opacity-50"
              >
                {loading ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mx-auto" /> : tab === "login" ? "Sign In" : "Create Account"}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AccountModal;
