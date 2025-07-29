import { ethers } from 'ethers';

export interface WalletData {
  address: string;
  privateKey: string;
  mnemonic: string;
  balance: string;
}

export interface CoinBalance {
  symbol: string;
  name: string;
  balance: string;
  usdValue: string;
  icon: string;
}

// Add in-memory password and per-chain provider support
let localPassword: string | null = null;
let passwordTimeout: NodeJS.Timeout | null = null;

const PASSWORD_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export function setLocalPassword(password: string) {
  localPassword = password;
  if (passwordTimeout) clearTimeout(passwordTimeout);
  passwordTimeout = setTimeout(() => {
    localPassword = null;
  }, PASSWORD_TIMEOUT_MS);
}

export function clearLocalPassword() {
  localPassword = null;
  if (passwordTimeout) clearTimeout(passwordTimeout);
}

export function isPasswordSet() {
  return !!localPassword;
}

export function requirePassword(password: string): boolean {
  return localPassword === password;
}

// Add per-chain RPC support
const DEFAULT_RPCS: Record<string, string> = {
  ETH: 'https://cloudflare-eth.com',
  BNB: 'https://bsc-dataseed1.binance.org',
  MATIC: 'https://polygon-rpc.com',
  AVAX: 'https://api.avax.network/ext/bc/C/rpc',
};

export class WalletManager {
  private static instance: WalletManager;
  private wallet: any = null;
  private providers: Record<string, ethers.JsonRpcProvider> = {};
  private rpcUrls: Record<string, string> = { ...DEFAULT_RPCS };

  static getInstance(): WalletManager {
    if (!WalletManager.instance) {
      WalletManager.instance = new WalletManager();
      // Migrate old Infura endpoint to Cloudflare for ETH
      if (WalletManager.instance.rpcUrls.ETH === 'https://mainnet.infura.io/v3/demo') {
        WalletManager.instance.rpcUrls.ETH = DEFAULT_RPCS.ETH;
      }
    }
    return WalletManager.instance;
  }

  setProvider(rpcUrl?: string, chain: string = 'ETH') {
    if (rpcUrl) {
      this.rpcUrls[chain] = rpcUrl;
    }
    this.providers[chain] = new ethers.JsonRpcProvider(this.rpcUrls[chain]);
  }

  createWallet(): WalletData {
    const wallet = ethers.Wallet.createRandom();
    this.wallet = wallet;
    
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic?.phrase || '',
      balance: '0'
    };
  }

  importFromPrivateKey(privateKey: string): WalletData {
    try {
      const wallet = new ethers.Wallet(privateKey);
      this.wallet = wallet;
      
      return {
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: '',
        balance: '0'
      };
    } catch (error) {
      throw new Error('Invalid private key');
    }
  }

  importFromMnemonic(mnemonic: string): WalletData {
    try {
      const wallet = ethers.Wallet.fromPhrase(mnemonic);
      this.wallet = wallet;
      
      return {
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic?.phrase || '',
        balance: '0'
      };
    } catch (error) {
      throw new Error('Invalid seed phrase');
    }
  }

  async getBalance(chain: string = 'ETH'): Promise<string> {
    if (!this.wallet || !this.providers[chain]) return '0';
    
    try {
      const balance = await this.providers[chain].getBalance(this.wallet.address);
      return ethers.formatEther(balance);
    } catch (error) {
      return '0';
    }
  }

  async sendTransaction(to: string, amount: string, chain: string = 'ETH'): Promise<string> {
    if (!this.wallet || !this.providers[chain]) {
      throw new Error('Wallet not initialized');
    }

    const connectedWallet = this.wallet.connect(this.providers[chain]);
    const tx = await connectedWallet.sendTransaction({
      to,
      value: ethers.parseEther(amount)
    });

    return tx.hash;
  }

  getSupportedCoins(): CoinBalance[] {
    return [
      {
        symbol: 'ETH',
        name: 'Ethereum',
        balance: '0.0000',
        usdValue: '$0.00',
        icon: '\u27e0'
      },
      {
        symbol: 'BNB',
        name: 'BNB Chain',
        balance: '0.0000',
        usdValue: '$0.00',
        icon: '\ud83d\udd36'
      },
      {
        symbol: 'MATIC',
        name: 'Polygon',
        balance: '0.0000',
        usdValue: '$0.00',
        icon: '\ud83d\udd2e'
      },
      {
        symbol: 'AVAX',
        name: 'Avalanche',
        balance: '0.0000',
        usdValue: '$0.00',
        icon: '\ud83d\udd3a'
      }
    ];
  }

  setCustomRpc(chain: string, rpcUrl: string) {
    this.rpcUrls[chain] = rpcUrl;
    this.setProvider(rpcUrl, chain);
  }

  getRpcUrls() {
    return { ...this.rpcUrls };
  }

  getCurrentWallet(): WalletData | null {
    if (!this.wallet) return null;
    
    return {
      address: this.wallet.address,
      privateKey: this.wallet.privateKey,
      mnemonic: this.wallet.mnemonic?.phrase || '',
      balance: '0'
    };
  }

  clearWallet() {
    this.wallet = null;
    this.providers = {};
    this.rpcUrls = { ...DEFAULT_RPCS };
    clearLocalPassword();
    // Only remove wallet-related data
    localStorage.removeItem('remembered_wallet');
  }
}