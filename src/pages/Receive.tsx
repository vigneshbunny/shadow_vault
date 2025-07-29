import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { WalletManager } from "@/lib/wallet";
import { ArrowLeft, Copy, Download, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import QRCode from "react-qr-code";
import React from "react";
import QRCodeLib from "qrcode";

const Receive = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const qrWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const walletManager = WalletManager.getInstance();
    const currentWallet = walletManager.getCurrentWallet();
    
    if (!currentWallet) {
      navigate('/launch');
      return;
    }

    setWalletAddress(currentWallet.address);
    generateQRCode(currentWallet.address);
  }, [navigate]);

  const generateQRCode = async (address: string, amountValue?: string) => {
    try {
      // Simple QR code generation using canvas
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create a simple pattern for demonstration
      // In a real app, you'd use a proper QR code library
      const qrData = amountValue ? `ethereum:${address}?value=${amountValue}` : address;
      
      // Fill with gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#8B5CF6');
      gradient.addColorStop(1, '#06B6D4');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add address text (simplified QR representation)
      ctx.fillStyle = 'white';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('QR Code', canvas.width / 2, canvas.height / 2 - 10);
      ctx.fillText('(Scan to pay)', canvas.width / 2, canvas.height / 2 + 10);
      
      setQrCodeUrl(canvas.toDataURL());
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Copied!",
      description: "Wallet address copied to clipboard",
    });
  };

  const shareAddress = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Shadow Vault Address',
        text: `Send crypto to this address: ${walletAddress}`,
      });
    } else {
      copyAddress();
    }
  };

  const downloadQR = async () => {
    try {
      // 1. Generate QR code image as data URL
      const qrDataUrl = await QRCodeLib.toDataURL(walletAddress, {
        errorCorrectionLevel: 'H',
        margin: 2, // minimal margin, we'll add our own
        width: 320,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });

      // 2. Create a new canvas for the final image
      const canvasWidth = 500;
      const canvasHeight = 600;
      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      // 3. Fill background
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // 4. Draw heading
      ctx.fillStyle = '#18181b';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('shadow_vault', canvasWidth / 2, 60);
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('qr code', canvasWidth / 2, 100);

      // 5. Draw QR code image
      const qrImg = new window.Image();
      qrImg.onload = () => {
        // Center QR code
        const qrSize = 320;
        const qrX = (canvasWidth - qrSize) / 2;
        const qrY = 130;
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

        // 6. Draw wallet address below QR
        ctx.font = 'bold 18px monospace';
        ctx.fillStyle = '#18181b';
        ctx.textAlign = 'center';
        // Split address if too long
        const address = walletAddress;
        if (address.length > 30) {
          ctx.fillText(address.slice(0, 30), canvasWidth / 2, qrY + qrSize + 40);
          ctx.fillText(address.slice(30), canvasWidth / 2, qrY + qrSize + 70);
        } else {
          ctx.fillText(address, canvasWidth / 2, qrY + qrSize + 50);
        }

        // 7. Download the canvas as PNG
        const finalUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = finalUrl;
        link.download = 'shadowvault-qr.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      qrImg.onerror = () => {
        toast({ title: 'Error', description: 'Failed to load QR code image', variant: 'destructive' });
      };
      qrImg.src = qrDataUrl;
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to generate QR code for download', variant: 'destructive' });
    }
  };

  const updateQR = () => {
    generateQRCode(walletAddress, amount);
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
          <h1 className="text-2xl font-bold">Receive Crypto</h1>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Your Wallet Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center" ref={qrWrapperRef}>
              <div className="text-3xl font-extrabold mb-1">ShadowVault</div>
              <div className="text-base font-semibold text-primary/80 mb-4">Ethereum (ETH-20) Network Address</div>
              <QRCode
                value={walletAddress}
                size={200}
                bgColor="#18181b"
                fgColor="#fff"
                level="H"
                style={{ background: '#18181b', padding: 8, borderRadius: 12 }}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Wallet Address</label>
              <div className="flex items-center space-x-2">
                <code className="flex-1 p-3 bg-background rounded-md text-sm break-all">
                  {walletAddress}
                </code>
                <Button onClick={copyAddress} variant="outline" size="icon">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={shareAddress} variant="outline" className="flex-1">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button onClick={downloadQR} variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download QR
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="p-4 bg-muted/50 rounded-md">
          <h3 className="font-medium mb-2">💡 How to Receive</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Share your wallet address or QR code with the sender</li>
            <li>• Support for all EVM-compatible networks</li>
            <li>• Transactions appear after network confirmation</li>
            <li>• Always verify the sender before sharing your address</li>
          </ul>
        </div>
      </div>

      <BottomNavigation currentPage="receive" />
    </div>
  );
};

export default Receive;