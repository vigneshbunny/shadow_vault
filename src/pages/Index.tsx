import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Security from "@/components/Security";
import GetStarted from "@/components/GetStarted";
import Footer from "@/components/Footer";
import { setLocalPassword, WalletManager } from "@/lib/wallet";
import CryptoJS from "crypto-js";
import { Input } from "@/components/ui/input";

const Index = () => {
  const navigate = useNavigate();
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const [restorePassword, setRestorePassword] = useState("");
  const [restoreError, setRestoreError] = useState("");

  useEffect(() => {
    const remembered = localStorage.getItem("remembered_wallet");
    if (remembered) {
      setShowRestorePrompt(true);
    }
    // Removed auto-redirect timer
  }, [navigate]);

  const handleRestore = () => {
    const remembered = localStorage.getItem("remembered_wallet");
    if (!remembered) return;
    try {
      const decrypted = CryptoJS.AES.decrypt(remembered, restorePassword).toString(CryptoJS.enc.Utf8);
      const { walletData, password } = JSON.parse(decrypted);
      const walletManager = WalletManager.getInstance();
      walletManager.importFromPrivateKey(walletData.privateKey);
      setLocalPassword(password);
      setShowRestorePrompt(false);
      setRestoreError("");
      navigate('/home');
    } catch {
      setRestoreError("Incorrect password or corrupted data");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Features />
      <Security />
      <GetStarted />
      <Footer />
      {/* Restore modal removed from landing page */}
    </div>
  );
};

export default Index;
