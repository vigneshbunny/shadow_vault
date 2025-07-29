import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { WalletManager } from "@/lib/wallet";
import { Copy, Eye, EyeOff, ArrowLeft, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { setLocalPassword } from "@/lib/wallet";
import { Input } from "@/components/ui/input";
import CryptoJS from "crypto-js";
import { useRef } from "react";

const CreateWallet = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [walletData, setWalletData] = useState<any>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const handleCreateWallet = () => {
    const walletManager = WalletManager.getInstance();
    const newWallet = walletManager.createWallet();
    setWalletData(newWallet);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const proceedToWallet = () => {
    if (!isConfirmed) {
      toast({
        title: "Security confirmation required",
        description: "Please confirm you've saved your seed phrase",
        variant: "destructive"
      });
      return;
    }
    if (!password || password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setLocalPassword(password);
    setPasswordError("");
    if (rememberMe) {
      // Encrypt wallet data and password, store in localStorage
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify({ walletData, password }), password).toString();
      localStorage.setItem("remembered_wallet", encrypted);
    }
    navigate('/home');
  };

  if (!walletData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-primary/10 flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full space-y-8 text-center">
          <Button
            onClick={() => navigate('/launch')}
            variant="ghost"
            className="absolute top-6 left-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="space-y-4">
            <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
              <Shield className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">Create New Wallet</h1>
            <p className="text-muted-foreground">
              Generate a new secure wallet with complete anonymity
            </p>
          </div>

          <Button
            onClick={handleCreateWallet}
            variant="hero"
            size="lg"
            className="w-full h-14 text-lg"
          >
            Generate Wallet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-primary/10 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button
          onClick={() => navigate('/launch')}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Wallet Created!</h1>
          <p className="text-muted-foreground">
            Save your seed phrase securely. It is the ONLY way to recover your wallet and all accounts.
          </p>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">🔐 Seed Phrase (Recovery)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-destructive/10 rounded-md">
              <p className="text-sm text-destructive font-medium mb-2">
                ⚠️ CRITICAL: Write this down and store it safely!
              </p>
              <p className="text-xs text-muted-foreground">
                This is the ONLY way to recover your wallet if you lose access. Never share it with anyone.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <code className="flex-1 p-3 bg-background rounded-md text-sm">
                {walletData.mnemonic}
              </code>
              <Button
                onClick={() => copyToClipboard(walletData.mnemonic, "Seed phrase")}
                variant="outline"
                size="icon"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* No private key shown here! */}

        <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-md">
          <input
            type="checkbox"
            id="confirm"
            checked={isConfirmed}
            onChange={(e) => setIsConfirmed(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="confirm" className="text-sm">
            I have securely saved my seed phrase and understand that losing it means losing access to my wallet forever.
          </label>
        </div>

        {walletData && (
          <form
            onSubmit={e => {
              e.preventDefault();
              proceedToWallet();
            }}
            className="space-y-4"
          >
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle>Set Local Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 relative">
                  <label className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <Input
                      ref={passwordRef}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter a password (min 6 chars)"
                      className="bg-background text-foreground pr-10"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          confirmPasswordRef.current?.focus();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2 relative">
                  <label className="text-sm font-medium">Confirm Password</label>
                  <div className="relative">
                    <Input
                      ref={confirmPasswordRef}
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      className="bg-background text-foreground pr-10"
                    />
                    <Button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-primary"
                  />
                  <label htmlFor="rememberMe" className="text-sm">Remember Me (store encrypted wallet on this device)</label>
                </div>
                {passwordError && <div className="text-red-500 text-sm">{passwordError}</div>}
                <div className="text-xs text-muted-foreground">
                  This password is only stored in memory and is required for sending, revealing keys, and other sensitive actions. It will be cleared on logout or refresh.<br/>
                  <span className="text-destructive">On remembering, any previously stored wallet will be cleared. Only one wallet can be stored at a time.</span>
                </div>
              </CardContent>
            </Card>
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full h-14 text-lg"
              disabled={!isConfirmed}
            >
              Access My Wallet
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateWallet;