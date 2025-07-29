import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, ExternalLink, RefreshCw } from "lucide-react";
import BottomNavigation from "@/components/BottomNavigation";
import { WalletManager } from "@/lib/wallet";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

interface Transaction {
  id: string;
  type: 'sent' | 'received';
  amount: string;
  address: string;
  timestamp: Date;
  status: 'confirmed' | 'pending' | 'failed';
  hash: string;
}

const History = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState('ETH');
  const [address, setAddress] = useState("");

  useEffect(() => {
    const walletManager = WalletManager.getInstance();
    const currentWallet = walletManager.getCurrentWallet();
    if (!currentWallet) return;
    setAddress(currentWallet.address);
    loadTransactions(selectedCoin, currentWallet.address);
  }, [selectedCoin]);

  const loadTransactions = async (coin: string, address: string) => {
    setIsLoading(true);
    let txs: Transaction[] = [];
    try {
      if (coin === 'ETH') {
        // Etherscan API (replace with your API key if available)
        const res = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&sort=desc`);
        const data = await res.json();
        if (data.status === "1") {
          txs = data.result.map((tx: any) => ({
            id: tx.hash,
            type: tx.from.toLowerCase() === address.toLowerCase() ? 'sent' : 'received',
            amount: (parseFloat(tx.value) / 1e18).toFixed(4),
            address: tx.from.toLowerCase() === address.toLowerCase() ? tx.to : tx.from,
            timestamp: new Date(parseInt(tx.timeStamp) * 1000),
            status: tx.isError === "0" ? 'confirmed' : 'failed',
            hash: tx.hash
          }));
        }
      } else if (coin === 'BNB') {
        // BscScan API (replace with your API key if available)
        const res = await fetch(`https://api.bscscan.com/api?module=account&action=txlist&address=${address}&sort=desc`);
        const data = await res.json();
        if (data.status === "1") {
          txs = data.result.map((tx: any) => ({
            id: tx.hash,
            type: tx.from.toLowerCase() === address.toLowerCase() ? 'sent' : 'received',
            amount: (parseFloat(tx.value) / 1e18).toFixed(4),
            address: tx.from.toLowerCase() === address.toLowerCase() ? tx.to : tx.from,
            timestamp: new Date(parseInt(tx.timeStamp) * 1000),
            status: tx.isError === "0" ? 'confirmed' : 'failed',
            hash: tx.hash
          }));
        }
      } else if (coin === 'MATIC') {
        // Polygonscan API (replace with your API key if available)
        const res = await fetch(`https://api.polygonscan.com/api?module=account&action=txlist&address=${address}&sort=desc`);
        const data = await res.json();
        if (data.status === "1") {
          txs = data.result.map((tx: any) => ({
            id: tx.hash,
            type: tx.from.toLowerCase() === address.toLowerCase() ? 'sent' : 'received',
            amount: (parseFloat(tx.value) / 1e18).toFixed(4),
            address: tx.from.toLowerCase() === address.toLowerCase() ? tx.to : tx.from,
            timestamp: new Date(parseInt(tx.timeStamp) * 1000),
            status: tx.isError === "0" ? 'confirmed' : 'failed',
            hash: tx.hash
          }));
        }
      } else if (coin === 'AVAX') {
        // Snowtrace API (replace with your API key if available)
        const res = await fetch(`https://api.snowtrace.io/api?module=account&action=txlist&address=${address}&sort=desc`);
        const data = await res.json();
        if (data.status === "1") {
          txs = data.result.map((tx: any) => ({
            id: tx.hash,
            type: tx.from.toLowerCase() === address.toLowerCase() ? 'sent' : 'received',
            amount: (parseFloat(tx.value) / 1e18).toFixed(4),
            address: tx.from.toLowerCase() === address.toLowerCase() ? tx.to : tx.from,
            timestamp: new Date(parseInt(tx.timeStamp) * 1000),
            status: tx.isError === "0" ? 'confirmed' : 'failed',
            hash: tx.hash
          }));
        }
      }
    } catch (e) {
      // fallback to local storage if API fails
      const localTxs = localStorage.getItem(`txs_${coin}_${address}`);
      if (localTxs) {
        txs = JSON.parse(localTxs);
      }
    }
    setTransactions(txs);
    setIsLoading(false);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const openInExplorer = (hash: string) => {
    // In a real app, this would open the transaction in a blockchain explorer
    window.open(`https://etherscan.io/tx/${hash}`, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-500';
      case 'pending': return 'text-yellow-500';
      case 'failed': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-primary/10 pb-20">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/home')}
              variant="ghost"
              size="icon"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">Transaction History</h1>
            <div className="ml-4 w-48">
              <Select value={selectedCoin} onValueChange={setSelectedCoin}>
                <SelectTrigger className="bg-background text-foreground border-input">
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground">
                  <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
                  <SelectItem value="BNB">BNB Chain (BNB)</SelectItem>
                  <SelectItem value="MATIC">Polygon (MATIC)</SelectItem>
                  <SelectItem value="AVAX">Avalanche (AVAX)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button
            onClick={() => loadTransactions(selectedCoin, address)}
            variant="ghost"
            size="icon"
            disabled={isLoading}
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-card/50 backdrop-blur-sm animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-muted rounded-full"></div>
                      <div className="space-y-2">
                        <div className="w-24 h-4 bg-muted rounded"></div>
                        <div className="w-32 h-3 bg-muted rounded"></div>
                      </div>
                    </div>
                    <div className="space-y-2 text-right">
                      <div className="w-20 h-4 bg-muted rounded"></div>
                      <div className="w-16 h-3 bg-muted rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowUpRight className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
              <p className="text-muted-foreground mb-4">
                Your transaction history will appear here once you start using your wallet.
              </p>
              <Button onClick={() => navigate('/send')} variant="outline">
                Send your first transaction
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <Card key={tx.id} className="bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'sent' 
                          ? 'bg-red-500/20 text-red-500' 
                          : 'bg-green-500/20 text-green-500'
                      }`}>
                        {tx.type === 'sent' ? 
                          <ArrowUpRight className="w-5 h-5" /> : 
                          <ArrowDownLeft className="w-5 h-5" />
                        }
                      </div>
                      <div>
                        <div className="font-medium capitalize">{tx.type}</div>
                        <div className="text-sm text-muted-foreground">
                          {tx.type === 'sent' ? 'To' : 'From'}: {formatAddress(tx.address)}
                        </div>
                        <div className={`text-xs ${getStatusColor(tx.status)}`}>
                          {tx.status}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <div className={`font-medium ${
                        tx.type === 'sent' ? 'text-red-500' : 'text-green-500'
                      }`}>
                        {tx.type === 'sent' ? '-' : '+'}{tx.amount} ETH
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTime(tx.timestamp)}
                      </div>
                      <Button
                        onClick={() => openInExplorer(tx.hash)}
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNavigation currentPage="history" />
    </div>
  );
};

export default History;