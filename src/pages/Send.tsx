import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { WalletManager } from "@/lib/wallet";
import { ArrowLeft, Send as SendIcon, Scan } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import { isPasswordSet, requirePassword } from "@/lib/wallet";

const Send = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState('ETH');
  const [gasFee, setGasFee] = useState('0.001');
  const [passwordPrompt, setPasswordPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [balance, setBalance] = useState('0');

  useEffect(() => {
    // Prefer navigation state, fallback to query string
    if (location.state && location.state.address) {
      setRecipientAddress(location.state.address);
    } else {
      const addressParam = searchParams.get('address');
      if (addressParam) {
        setRecipientAddress(addressParam);
      }
    }
  }, [location.state, searchParams]);

  useEffect(() => {
    const fetchBalance = async () => {
      const walletManager = WalletManager.getInstance();
      walletManager.setProvider(undefined, selectedCoin);
      const bal = await walletManager.getBalance(selectedCoin);
      setBalance(parseFloat(bal).toFixed(4));
    };
    fetchBalance();
  }, [selectedCoin]);

  const handleSend = async () => {
    if (!recipientAddress || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    if (parseFloat(amount) + parseFloat(gasFee) > parseFloat(balance)) {
      toast({
        title: "Insufficient Funds",
        description: `You do not have enough ${selectedCoin} to cover the amount and gas fee`,
        variant: "destructive"
      });
      return;
    }
    setPasswordPrompt(true);
  };

  const confirmSend = async () => {
    if (!requirePassword(password)) {
      setPasswordError("Incorrect password");
      return;
    }
    setIsLoading(true);
    try {
      const walletManager = WalletManager.getInstance();
      walletManager.setProvider(undefined, selectedCoin);
      const txHash = await walletManager.sendTransaction(recipientAddress, amount, selectedCoin);
      
      toast({
        title: "Transaction Sent!",
        description: `Transaction hash: ${txHash.slice(0, 10)}...`,
      });
      
      // Reset form
      setRecipientAddress("");
      setAmount("");
      setPassword("");
      setPasswordPrompt(false);
      navigate('/home');
    } catch (error: any) {
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to send transaction",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold">Send Crypto</h1>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <SendIcon className="w-5 h-5" />
              <span>Send Transaction</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Coin</label>
              <Select value={selectedCoin} onValueChange={setSelectedCoin}>
                <SelectTrigger className="bg-background text-foreground border-input">
                  <SelectValue placeholder="Select a coin" />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground">
                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                  <SelectItem value="BNB">BNB Chain (BNB)</SelectItem>
                  <SelectItem value="MATIC">Polygon (MATIC)</SelectItem>
                  <SelectItem value="AVAX">Avalanche (AVAX)</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-xs text-muted-foreground mt-1">Make sure to select the correct network for the coin you are sending.</div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Recipient Address</label>
              <div className="flex space-x-2">
                <Input
                  placeholder="0x... or ENS name"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="font-mono bg-background text-foreground"
                />
                <Button
                  onClick={() => navigate('/scan?action=send')}
                  variant="outline"
                  size="icon"
                >
                  <Scan className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount ({selectedCoin})</label>
              <Input
                type="number"
                placeholder={`0.0 ${selectedCoin}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.0001"
                min="0"
                className="bg-background text-foreground"
              />
              <div className="text-xs text-muted-foreground">Balance: {balance} {selectedCoin}</div>
            </div>
            <div className="p-4 bg-muted/50 rounded-md space-y-2">
              <div className="flex justify-between text-sm">
                <span>Network Fee</span>
                <span>~{gasFee} {selectedCoin}</span>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>Total</span>
                <span>{amount ? (parseFloat(amount) + parseFloat(gasFee)).toFixed(4) : '0.0000'} {selectedCoin}</span>
              </div>
            </div>
            <Button
              onClick={handleSend}
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isLoading || !recipientAddress || !amount}
            >
              {isLoading ? "Sending..." : "Send Transaction"}
            </Button>
          </CardContent>
        </Card>

        {passwordPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded shadow-lg w-full max-w-sm border border-primary">
              <h2 className="text-lg font-bold mb-4 text-primary">Enter Password</h2>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your local password"
                className="bg-background text-foreground"
              />
              {passwordError && <div className="text-red-500 text-sm mb-2">{passwordError}</div>}
              <div className="flex space-x-2 mt-4">
                <Button onClick={confirmSend} variant="hero" className="flex-1">Confirm</Button>
                <Button onClick={() => { setPasswordPrompt(false); setPassword(""); setPasswordError(""); }} variant="outline" className="flex-1">Cancel</Button>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-destructive/10 rounded-md border border-destructive/20">
          <h3 className="font-medium text-destructive mb-2">⚠️ Security Notice</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Double-check the recipient address before sending</li>
            <li>• Transactions on blockchain are irreversible</li>
            <li>• Start with small amounts for new addresses</li>
            <li>• Network fees are required and non-refundable</li>
          </ul>
        </div>
      </div>

      <BottomNavigation currentPage="send" />
    </div>
  );
};

export default Send;