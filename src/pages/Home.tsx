import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { WalletManager } from "@/lib/wallet";
import { Send, QrCode, Scan, Eye, EyeOff, Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import { Skeleton } from "@/components/ui/skeleton";

const COINGECKO_IDS = {
  ETH: "ethereum",
  BNB: "binancecoin",
  MATIC: "matic-network",
  AVAX: "avalanche-2"
};

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [balance, setBalance] = useState("0.0000");
  const [showBalance, setShowBalance] = useState(true);
  const [walletAddress, setWalletAddress] = useState("");
  const [supportedCoins, setSupportedCoins] = useState<any[]>([]);
  const [coinBalances, setCoinBalances] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [usdPrices, setUsdPrices] = useState<{ [symbol: string]: { price: number; change: number } }>({});
  const [totalUsd, setTotalUsd] = useState(0);

  useEffect(() => {
    const walletManager = WalletManager.getInstance();
    const currentWallet = walletManager.getCurrentWallet();
    if (!currentWallet) {
      navigate('/launch');
      return;
    }
    setWalletAddress(currentWallet.address);
    const supported = walletManager.getSupportedCoins();
    setSupportedCoins(supported);
    fetchAllBalances();
  }, [navigate]);

  const fetchUsdPrices = async () => {
    try {
      const ids = Object.values(COINGECKO_IDS).join(",");
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`);
      const data = await res.json();
      return {
        ETH: { price: data[COINGECKO_IDS.ETH]?.usd || 0, change: data[COINGECKO_IDS.ETH]?.usd_24h_change || 0 },
        BNB: { price: data[COINGECKO_IDS.BNB]?.usd || 0, change: data[COINGECKO_IDS.BNB]?.usd_24h_change || 0 },
        MATIC: { price: data[COINGECKO_IDS.MATIC]?.usd || 0, change: data[COINGECKO_IDS.MATIC]?.usd_24h_change || 0 },
        AVAX: { price: data[COINGECKO_IDS.AVAX]?.usd || 0, change: data[COINGECKO_IDS.AVAX]?.usd_24h_change || 0 }
      };
    } catch {
      return {
        ETH: { price: 0, change: 0 },
        BNB: { price: 0, change: 0 },
        MATIC: { price: 0, change: 0 },
        AVAX: { price: 0, change: 0 }
      };
    }
  };

  const refreshBalance = async () => {
    setIsRefreshing(true);
    try {
      await fetchAllBalances();
    } catch (error) {
      console.error('Error refreshing balances:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchAllBalances = async () => {
    setLoading(true);
    const walletManager = WalletManager.getInstance();
    const coins = walletManager.getSupportedCoins();
    const prices = await fetchUsdPrices();
    setUsdPrices(prices);
    let totalUsdSum = 0;
    const balances = await Promise.all(
      coins.map(async (coin) => {
        walletManager.setProvider(undefined, coin.symbol);
        const bal = await walletManager.getBalance(coin.symbol);
        const balanceNum = parseFloat(bal);
        const usd = prices[coin.symbol]?.price || 0;
        const change = prices[coin.symbol]?.change || 0;
        const usdValue = balanceNum * usd;
        totalUsdSum += usdValue;
        return {
          ...coin,
          balance: balanceNum.toFixed(4),
          usdValue: usd > 0 ? `$${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}` : 'N/A',
          price: usd > 0 ? `$${usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}` : 'N/A',
          change
        };
      })
    );
    setCoinBalances(balances);
    setTotalUsd(totalUsdSum);
    setLoading(false);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Copied!",
      description: "Wallet address copied to clipboard",
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-primary/10 pb-20">
      {/* Header */}
      <div className="p-6 text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <h1 className="text-2xl font-bold">Shadow Vault</h1>
          <Button
            onClick={refreshBalance}
            variant="ghost"
            size="icon"
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <span>{formatAddress(walletAddress)}</span>
          <Button onClick={copyAddress} variant="ghost" size="icon" className="h-6 w-6">
            <Copy className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Balance Display */}
      <div className="px-6 mb-8">
        <Card className="bg-gradient-primary text-primary-foreground shadow-glow">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-sm opacity-90">Total Balance</span>
              <Button
                onClick={() => setShowBalance(!showBalance)}
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-primary-foreground hover:bg-white/20"
              >
                {showBalance ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </Button>
            </div>
            <div className="text-4xl font-bold mb-1">
              {showBalance ? `$${totalUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}` : '••••••'}
            </div>
            <div className="text-sm opacity-75">
              {showBalance ? `${coinBalances.map(c => c.balance + ' ' + c.symbol).join(' + ')}` : '••••••'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="px-6 mb-8">
        <div className="grid grid-cols-3 gap-4">
          <Button
            onClick={() => navigate('/send')}
            variant="outline"
            className="h-20 flex-col space-y-2"
          >
            <Send className="w-6 h-6" />
            <span>Send</span>
          </Button>
          <Button
            onClick={() => navigate('/receive')}
            variant="outline"
            className="h-20 flex-col space-y-2"
          >
            <QrCode className="w-6 h-6" />
            <span>Receive</span>
          </Button>
          <Button
            onClick={() => navigate('/scan')}
            variant="outline"
            className="h-20 flex-col space-y-2"
          >
            <Scan className="w-6 h-6" />
            <span>Scan</span>
          </Button>
        </div>
      </div>

      {/* Supported Coins */}
      <div className="px-6 space-y-4">
        <h2 className="text-lg font-semibold">Supported Assets</h2>
        <div className="space-y-3">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="bg-card/50 backdrop-blur-sm animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-muted rounded-full" />
                        <div>
                          <div className="w-24 h-4 bg-muted rounded mb-2" />
                          <div className="w-16 h-3 bg-muted rounded" />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="w-20 h-4 bg-muted rounded mb-2" />
                        <div className="w-16 h-3 bg-muted rounded" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            : coinBalances.map((coin, index) => (
                <>
                  <Card key={index} className="bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg">
                            {coin.icon}
                          </div>
                          <div>
                            <div className="font-medium flex items-center space-x-2">
                              <span>{coin.name}</span>
                              <span className="text-xs text-muted-foreground">{coin.price}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="text-sm text-muted-foreground">{coin.symbol}</div>
                              <div className={`text-xs ${coin.change > 0 ? 'text-green-600' : coin.change < 0 ? 'text-red-600' : 'text-muted-foreground'}`.trim()}>
                                {coin.change > 0 ? '+' : ''}{coin.change.toFixed(2)}% 24h
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {showBalance ? coin.balance : '••••'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {showBalance ? coin.usdValue : '••••'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {index === 3 && <div className="h-6" />}
                </>
              ))}
        </div>
      </div>

      <BottomNavigation currentPage="home" />
    </div>
  );
};

export default Home;