import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, Eye, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { setLocalPassword, WalletManager } from "@/lib/wallet";
import CryptoJS from "crypto-js";
import { Input } from "@/components/ui/input";

const Launch = () => {
  const navigate = useNavigate();
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const [restorePassword, setRestorePassword] = useState("");
  const [restoreError, setRestoreError] = useState("");
  const [hasLocalWallet, setHasLocalWallet] = useState(false);

  useEffect(() => {
    const walletManager = WalletManager.getInstance();
    const remembered = localStorage.getItem("remembered_wallet");
    const currentWallet = walletManager.getCurrentWallet();
    setHasLocalWallet(!!remembered && !currentWallet);
    // Do not auto-open restore modal anymore
  }, []);

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
      // Keep modal open and do not remove remembered_wallet
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-primary/10 flex flex-col items-center justify-center p-6 relative">
      {/* Back Arrow */}
      <Button
        onClick={() => navigate('/')}
        variant="ghost"
        size="icon"
        className="absolute top-6 left-6 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>
      
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo */}
        <div className="space-y-4">
          <div className="mx-auto w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
            <Shield className="w-12 h-12 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Shadow Vault
          </h1>
          <p className="text-muted-foreground text-lg">
            Ultimate Privacy. Complete Anonymity.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4" />
            <span>Zero tracking • Open source • Local only</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Eye className="w-4 h-4" />
            <span>No KYC • No data collection • Pure anonymity</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 pt-8">
          <Button
            onClick={() => navigate('/create-wallet')}
            variant="hero"
            size="lg"
            className="w-full h-14 text-lg"
          >
            Create New Wallet
          </Button>
          
          <Button
            onClick={() => navigate('/import-wallet')}
            variant="outline"
            size="lg"
            className="w-full h-14 text-lg"
          >
            Import Existing Wallet
          </Button>
          {hasLocalWallet && (
            <Button
              onClick={() => setShowRestorePrompt(true)}
              variant="secondary"
              size="lg"
              className="w-full h-14 text-lg"
            >
              Recover Local Stored Wallet
            </Button>
          )}
        </div>

        {/* Security Notice */}
        <div className="pt-6 text-xs text-muted-foreground/70 space-y-1">
          <p>🔒 All data stored locally on your device</p>
          <p>🚫 No servers • No tracking • No logs</p>
          <p>🔐 You control your private keys</p>
        </div>
      </div>
      {showRestorePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded shadow-lg w-full max-w-sm border border-primary">
            <h2 className="text-lg font-bold mb-4 text-primary">Restore Wallet</h2>
            <Input
              type="password"
              value={restorePassword}
              onChange={e => setRestorePassword(e.target.value)}
              placeholder="Enter your wallet password"
              className="bg-background text-foreground"
              onKeyDown={e => { if (e.key === 'Enter') handleRestore(); }}
            />
            {restoreError && <div className="text-red-500 text-sm mb-2">{restoreError}</div>}
            <div className="flex space-x-2 mt-4">
              <button onClick={handleRestore} className="flex-1 bg-primary text-primary-foreground rounded px-4 py-2">Restore</button>
              <button onClick={() => { setShowRestorePrompt(false); setRestoreError(""); setRestorePassword(""); }} className="flex-1 bg-muted text-foreground rounded px-4 py-2">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Launch;