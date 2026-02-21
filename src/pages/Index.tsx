import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import PricingSection from "@/components/PricingSection";
import SafetySection from "@/components/SafetySection";
import TOSSection from "@/components/TOSSection";
import Footer from "@/components/Footer";
import PurchaseModal from "@/components/PurchaseModal";
import AccountModal from "@/components/AccountModal";

export type Product = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  license: string;
};

const Index = () => {
  const [purchaseProduct, setPurchaseProduct] = useState<Product | null>(null);
  const [showAccount, setShowAccount] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onAccountClick={() => setShowAccount(true)} />
      <HeroSection />
      <ProductsSection onPurchase={setPurchaseProduct} />
      <PricingSection onPurchase={setPurchaseProduct} />
      <SafetySection />
      <TOSSection />
      <Footer />
      {purchaseProduct && (
        <PurchaseModal
          product={purchaseProduct}
          onClose={() => setPurchaseProduct(null)}
          onShowAccount={() => setShowAccount(true)}
        />
      )}
      {showAccount && (
        <AccountModal onClose={() => setShowAccount(false)} />
      )}
    </div>
  );
};

export default Index;
