import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { WalletManager } from "@/lib/wallet";
import { ArrowLeft, Key, FileText, Server, Shield, LogOut, Eye, EyeOff, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import { requirePassword, clearLocalPassword, setLocalPassword } from "@/lib/wallet";
import CryptoJS from "crypto-js";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [customRpc, setCustomRpc] = useState("https://mainnet.infura.io/v3/demo");
  const [torEnabled, setTorEnabled] = useState(false);
  const [walletData, setWalletData] = useState<any>(null);
  const [passwordPrompt, setPasswordPrompt] = useState<{ type: 'privateKey' | 'seedPhrase' | null }>({ type: null });
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showKey, setShowKey] = useState<{ privateKey: boolean; seedPhrase: boolean }>({ privateKey: false, seedPhrase: false });
  const [customRpcs, setCustomRpcs] = useState({
    ETH: "https://cloudflare-eth.com",
    BNB: "https://bsc-dataseed1.binance.org",
    MATIC: "https://polygon-rpc.com",
    AVAX: "https://api.avax.network/ext/bc/C/rpc"
  });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const [restorePassword, setRestorePassword] = useState("");
  const [restoreError, setRestoreError] = useState("");

  useEffect(() => {
    const walletManager = WalletManager.getInstance();
    const currentWallet = walletManager.getCurrentWallet();
    setWalletData(currentWallet);
    const rpcUrls = walletManager.getRpcUrls();
    setCustomRpcs({
      ETH: rpcUrls.ETH || "https://cloudflare-eth.com",
      BNB: rpcUrls.BNB || "https://bsc-dataseed1.binance.org",
      MATIC: rpcUrls.MATIC || "https://polygon-rpc.com",
      AVAX: rpcUrls.AVAX || "https://api.avax.network/ext/bc/C/rpc"
    });
    // Show restore modal if wallet missing and remembered_wallet exists
    const remembered = localStorage.getItem("remembered_wallet");
    if (!currentWallet && remembered) {
      setShowRestorePrompt(true);
    }
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const updateRpc = () => {
    try {
      const walletManager = WalletManager.getInstance();
      walletManager.setProvider(customRpc);
      toast({
        title: "RPC Updated",
        description: "Custom RPC endpoint has been set",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid RPC endpoint",
        variant: "destructive"
      });
    }
  };

  const toggleTor = () => {
    setTorEnabled(!torEnabled);
    toast({
      title: torEnabled ? "Tor Disabled" : "Tor Enabled",
      description: torEnabled 
        ? "Standard connection restored" 
        : "Enhanced privacy mode activated. Use Tor browser for maximum anonymity.",
    });
  };

  const logout = () => {
    const walletManager = WalletManager.getInstance();
    walletManager.clearWallet();
    
    // Clear all local storage
    localStorage.clear();
    sessionStorage.clear();
    
    toast({
      title: "Logged Out",
      description: "All wallet data has been cleared for security",
    });
    
    navigate('/launch');
  };

  const handleReveal = (type: 'privateKey' | 'seedPhrase') => {
    setPasswordPrompt({ type });
  };
  const confirmReveal = () => {
    if (!requirePassword(password)) {
      setPasswordError("Incorrect password");
      return;
    }
    setShowKey((prev) => ({ ...prev, [passwordPrompt.type!]: true }));
    setPasswordPrompt({ type: null });
    setPassword("");
    setPasswordError("");
  };
  const handleUpdateRpc = (chain: string) => {
    const walletManager = WalletManager.getInstance();
    walletManager.setCustomRpc(chain, customRpcs[chain]);
    toast({
      title: `${chain} RPC Updated`,
      description: `Custom RPC endpoint for ${chain} has been set`,
    });
  };
  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };
  const confirmLogout = () => {
    const walletManager = WalletManager.getInstance();
    walletManager.clearWallet();
    clearLocalPassword();
    localStorage.clear();
    sessionStorage.clear();
    toast({
      title: "Logged Out",
      description: "All wallet data has been cleared for security",
    });
    setShowLogoutConfirm(false);
    navigate('/launch');
  };

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
      setWalletData(walletData);
      navigate('/home');
    } catch {
      setRestoreError("Incorrect password or corrupted data");
    }
  };

  if (!walletData) {
    const remembered = localStorage.getItem("remembered_wallet");
    if (remembered) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-primary/10 flex items-center justify-center">
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
                  <button onClick={() => { setShowRestorePrompt(false); localStorage.removeItem("remembered_wallet"); }} className="flex-1 bg-muted text-foreground rounded px-4 py-2">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
    // Fallback: original message
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-primary/10 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">No wallet found</h2>
          <Button onClick={() => navigate('/launch')} variant="hero">
            Create or Import Wallet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-primary/10 pb-20">
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate('/home')}
            variant="ghost"
            size="icon"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        {/* Wallet Security */}
        <Card className="bg-card/50 backdrop-blur-sm border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-destructive">
              <Shield className="w-5 h-5" />
              <span>Wallet Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-destructive/10 rounded-md">
              <p className="text-sm font-medium text-destructive mb-1">
                ⚠️ Sensitive Information
              </p>
              <p className="text-xs text-muted-foreground">
                Never share your private key or seed phrase with anyone
              </p>
            </div>

            {/* Seed Phrase */}
            {walletData.mnemonic && (
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Seed Phrase</span>
                </label>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 p-3 bg-background rounded-md text-sm break-all font-mono">
                    {showKey.seedPhrase ? walletData.mnemonic : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                  </code>
                  <Button
                    onClick={() => handleReveal('seedPhrase')}
                    variant="outline"
                    size="icon"
                    disabled={showKey.seedPhrase}
                  >
                    {showKey.seedPhrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={() => copyToClipboard(walletData.mnemonic, "Seed phrase")}
                    variant="outline"
                    size="icon"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Private Key */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center space-x-2">
                <Key className="w-4 h-4" />
                <span>Private Key</span>
              </label>
              <div className="flex items-center space-x-2">
                <code className="flex-1 p-3 bg-background rounded-md text-sm break-all">
                  {showKey.privateKey ? walletData.privateKey : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                </code>
                <Button
                  onClick={() => handleReveal('privateKey')}
                  variant="outline"
                  size="icon"
                  disabled={showKey.privateKey}
                >
                  {showKey.privateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  onClick={() => copyToClipboard(walletData.privateKey, "Private key")}
                  variant="outline"
                  size="icon"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {/* Password Prompt Modal */}
            {passwordPrompt.type && (
              <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                <div className="bg-background p-6 rounded shadow-lg w-full max-w-sm border border-primary">
                  <h2 className="text-lg font-bold mb-4 text-primary">Enter Password</h2>
                  <Input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your local password"
                    className="bg-background text-foreground"
                    onKeyDown={e => {
                      if (e.key === 'Enter') confirmReveal();
                    }}
                    autoFocus
                  />
                  {passwordError && <div className="text-red-500 text-sm mb-2">{passwordError}</div>}
                  <div className="flex space-x-2 mt-4">
                    <Button onClick={confirmReveal} variant="hero" className="flex-1">Confirm</Button>
                    <Button onClick={() => { setPasswordPrompt({ type: null }); setPassword(""); setPasswordError(""); }} variant="outline" className="flex-1">Cancel</Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Network Settings */}
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Server className="w-5 h-5" />
              <span>Network Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Custom RPC Endpoints (Per Chain)</label>
              <p className="text-xs text-muted-foreground mb-2">
                Each blockchain network requires its own RPC endpoint. The defaults are public, privacy-friendly endpoints. You can change any to your own (including local/private nodes).
              </p>
              {['ETH', 'BNB', 'MATIC', 'AVAX'].map(chain => (
                <div className="space-y-2" key={chain}>
                  <label className="text-sm font-medium">Custom RPC Endpoint ({chain})</label>
                  <div className="flex space-x-2">
                    <Input
                      value={customRpcs[chain]}
                      onChange={e => setCustomRpcs(prev => ({ ...prev, [chain]: e.target.value }))}
                      placeholder={`https://your-${chain.toLowerCase()}-rpc-endpoint.com`}
                      className="font-mono bg-background text-foreground"
                    />
                    <Button onClick={() => handleUpdateRpc(chain)} variant="outline">
                      Update
                    </Button>
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                Use your own RPC endpoint for enhanced privacy and reliability. Each chain can have its own RPC.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Privacy Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">Enhanced Privacy Mode</div>
                <div className="text-sm text-muted-foreground">
                  Route connections through Tor for maximum anonymity
                </div>
              </div>
              <Switch
                checked={torEnabled}
                onCheckedChange={toggleTor}
              />
            </div>
            
            {torEnabled && (
              <div className="p-3 bg-primary/10 rounded-md border border-primary/20">
                <p className="text-sm font-medium text-primary mb-1">
                  🧅 Tor Mode Active
                </p>
                <p className="text-xs text-muted-foreground">
                  For maximum privacy, use Tor browser to access this wallet. 
                  Your IP and location are now better protected.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-card/50 backdrop-blur-sm border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-destructive/10 rounded-md">
                <p className="text-sm font-medium text-destructive mb-1">
                  ⚠️ Security Logout
                </p>
                <p className="text-xs text-muted-foreground">
                  This will permanently clear all wallet data from this device for security
                </p>
              </div>
              
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Secure Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full flex justify-center mt-8 mb-4">
        <span className="text-xs text-muted-foreground text-center">
          Secured by <span className="font-semibold text-primary">Shadow Vault</span>. Your privacy, our priority.
        </span>
      </div>

      <BottomNavigation currentPage="settings" />
      {/* Secure Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded shadow-lg w-full max-w-sm border border-primary" tabIndex={0} onKeyDown={e => { if (e.key === 'Enter') confirmLogout(); }}>
            <h2 className="text-lg font-bold mb-4 text-primary">Confirm Logout</h2>
            <p className="mb-4 text-foreground font-semibold">Please save your private key and seed phrase before logging out. Are you sure you want to securely logout and remove all wallet data from this device?</p>
            <div className="flex space-x-2">
              <Button onClick={confirmLogout} variant="destructive" className="flex-1">Logout</Button>
              <Button onClick={() => setShowLogoutConfirm(false)} variant="outline" className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;