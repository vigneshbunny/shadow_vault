import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { WalletManager } from "@/lib/wallet";
import { ArrowLeft, Shield, Key, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { setLocalPassword } from "@/lib/wallet";
import CryptoJS from "crypto-js";

const ImportWallet = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [privateKey, setPrivateKey] = useState("");
  const [seedPhrase, setSeedPhrase] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [importTab, setImportTab] = useState<'seedPhrase' | 'privateKey'>('seedPhrase');

  const handleImportPrivateKey = async () => {
    if (!privateKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a private key",
        variant: "destructive"
      });
      return;
    }
    setShowPasswordPrompt(true);
  };

  const handleImportSeedPhrase = async () => {
    if (!seedPhrase.trim()) {
      toast({
        title: "Error",
        description: "Please enter a seed phrase",
        variant: "destructive"
      });
      return;
    }
    setShowPasswordPrompt(true);
  };

  const completeImport = async (importType: 'privateKey' | 'seedPhrase') => {
    if (!password || password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    try {
      const walletManager = WalletManager.getInstance();
      let importedWallet;
      if (importType === 'privateKey') {
        importedWallet = walletManager.importFromPrivateKey(privateKey.trim());
      } else {
        importedWallet = walletManager.importFromMnemonic(seedPhrase.trim());
      }
      setLocalPassword(password);
      setPasswordError("");
      if (rememberMe) {
        // Encrypt wallet data and password, store in localStorage
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify({ walletData: importedWallet, password }), password).toString();
        localStorage.setItem("remembered_wallet", encrypted);
      }
      toast({
        title: "Success!",
        description: "Wallet imported successfully",
      });
      navigate('/home');
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Invalid credentials",
        variant: "destructive"
      });
    }
  };

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
          <h1 className="text-3xl font-bold">Import Wallet</h1>
          <p className="text-muted-foreground">
            Restore your wallet using your seed phrase (recommended) or private key.
          </p>
        </div>
        <Tabs value={importTab} onValueChange={value => setImportTab(value as 'seedPhrase' | 'privateKey')} className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="seedPhrase">Seed Phrase</TabsTrigger>
            <TabsTrigger value="privateKey">Private Key</TabsTrigger>
          </TabsList>
          <TabsContent value="seedPhrase">
            {/* Seed Phrase Import UI */}
            <div className="space-y-4">
              <Textarea
                value={seedPhrase}
                onChange={e => setSeedPhrase(e.target.value)}
                placeholder="Enter your 12 or 24 word seed phrase"
                className="bg-background text-foreground"
              />
              <Button onClick={handleImportSeedPhrase} variant="hero" className="w-full h-12 text-lg" disabled={isLoading}>
                Import with Seed Phrase
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="privateKey">
            {/* Private Key Import UI */}
            <div className="space-y-4">
              <Input
                value={privateKey}
                onChange={e => setPrivateKey(e.target.value)}
                placeholder="Enter your private key"
                className="bg-background text-foreground"
              />
              <Button onClick={handleImportPrivateKey} variant="outline" className="w-full h-12 text-lg" disabled={isLoading}>
                Import with Private Key
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        {showPasswordPrompt && (
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>Set Local Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter a password (min 6 chars)"
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="bg-background text-foreground"
                />
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
                This password is only stored in memory and is required for sending, revealing keys, and other sensitive actions. It will be cleared on logout or refresh.
              </div>
              <Button
                onClick={() => completeImport(privateKey ? 'privateKey' : 'seedPhrase')}
                variant="hero"
                size="lg"
                className="w-full"
              >
                Complete Import
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="p-4 bg-destructive/10 rounded-md border border-destructive/20">
          <h3 className="font-medium text-destructive mb-2">🔒 Security Notice</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Never share your private key or seed phrase with anyone</li>
            <li>• Make sure you're on the correct website</li>
            <li>• Your credentials are processed locally and never sent to any server</li>
            <li>• Clear browser data after use for maximum security</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImportWallet;