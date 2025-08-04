import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Camera, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/BottomNavigation";
import { Input } from "@/components/ui/input";
import { useLocation } from "react-router-dom";
import * as QrReader from 'react-qr-reader';
import { BrowserQRCodeReader } from '@zxing/browser';
import { useEffect } from "react";
import CameraDebug from "@/components/CameraDebug";

const Scan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const action = searchParams.get('action');
  const [scannedData, setScannedData] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [cameraErrorDetail, setCameraErrorDetail] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isHttps, setIsHttps] = useState(true);
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const codeReaderRef = useRef<BrowserQRCodeReader | null>(null);
  const controlsRef = useRef<any>(null);
  const isUnmountedRef = useRef(false);

  // Check HTTPS and camera permissions on mount
  useEffect(() => {
    // Check if we're on HTTPS
    const protocol = window.location.protocol;
    setIsHttps(protocol === 'https:');
    
    // Check camera permissions
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'camera' as PermissionName })
        .then((permissionStatus) => {
          setCameraPermission(permissionStatus.state);
          permissionStatus.onchange = () => {
            setCameraPermission(permissionStatus.state);
          };
        })
        .catch(() => {
          setCameraPermission('unknown');
        });
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isUnmountedRef.current = true;
      if (controlsRef.current) {
        controlsRef.current.stop();
        controlsRef.current = null;
      }
      codeReaderRef.current = null;
      // Stop video stream if active
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  const startCamera = async () => {
    // Check HTTPS requirement
    if (!isHttps) {
      setCameraError("Camera access requires HTTPS");
      setCameraErrorDetail("Please access this site via HTTPS to use the camera scanner");
      setIsCameraActive(false);
      return;
    }

    // Check camera permissions
    if (cameraPermission === 'denied') {
      setCameraError("Camera permission denied");
      setCameraErrorDetail("Please enable camera access in your browser settings");
      setIsCameraActive(false);
      return;
    }

    try {
      // Request camera permission with simple settings
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Set the stream to the video element
      const videoElement = videoRef.current;
      if (!videoElement) return;
      
      videoElement.srcObject = stream;
      videoElement.onloadedmetadata = () => {
        videoElement.play().catch(console.error);
      };
      
      // Simple QR reader setup - no complex timing
      codeReaderRef.current = new BrowserQRCodeReader();
      codeReaderRef.current.decodeFromVideoDevice(undefined, videoElement, (result, err, controls) => {
        if (isUnmountedRef.current) return;
        if (controls && !controlsRef.current) {
          controlsRef.current = controls;
        }
        if (result) {
          setScannedData(result.getText());
          setIsCameraActive(false);
          if (controlsRef.current) controlsRef.current.stop();
          toast({
            title: "QR Code Scanned!",
            description: "Address detected successfully",
          });
          if (action === 'send') {
            navigate(`/send`, { state: { address: result.getText() } });
          }
        }
        // Only show fatal errors, ignore scanning errors
        if (err) {
          const nonFatal = ["notfoundexception", "checksumexception", "formatexception"];
          if (err.name && nonFatal.some(type => err.name.toLowerCase().includes(type))) {
            return; // Keep scanning
          }
          // Only show error for real camera issues
          console.error('Camera error:', err);
        }
      });
      
    } catch (error: any) {
      console.error('Camera error:', error);
      
      if (error.name === 'NotAllowedError') {
        setCameraError("Camera access denied");
        setCameraErrorDetail("Please allow camera access when prompted");
        setCameraPermission('denied');
      } else if (error.name === 'NotFoundError') {
        setCameraError("No camera found");
        setCameraErrorDetail("No camera device detected on your device");
      } else if (error.name === 'NotSupportedError') {
        setCameraError("Camera not supported");
        setCameraErrorDetail("Your browser doesn't support camera access");
      } else if (error.name === 'NotReadableError') {
        setCameraError("Camera in use");
        setCameraErrorDetail("Camera is being used by another application");
      } else {
        setCameraError("Camera error: " + (error.message || error.name));
        setCameraErrorDetail(error.message || String(error));
      }
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    if (!isCameraActive) return;
    startCamera();
    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
        controlsRef.current = null;
      }
      codeReaderRef.current = null;
      // Stop video stream if active
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
    // eslint-disable-next-line
  }, [isCameraActive]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageDataUrl = e.target?.result as string;
      if (!imageDataUrl) return;
      const img = new window.Image();
      img.src = imageDataUrl;
      img.onload = async () => {
        try {
          // Draw image to canvas for reliable QR decoding
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('Canvas context not available');
          ctx.drawImage(img, 0, 0, img.width, img.height);
          // Use ZXing to decode from canvas
          codeReaderRef.current = new BrowserQRCodeReader();
          const result = await codeReaderRef.current.decodeFromCanvas(canvas);
          setScannedData(result.getText());
          toast({
            title: "QR Code Scanned!",
            description: "Address detected successfully",
          });
        } catch (err: any) {
          // Accept NotFoundException, ChecksumException, and FormatException variants as non-fatal (show toast, don't set fatal error)
          const nonFatal = ["notfoundexception", "checksumexception", "formatexception"];
          if (err.name && nonFatal.some(type => err.name.toLowerCase().includes(type))) {
            toast({
              title: "No QR code found in image.",
              description: "Try another image.",
              variant: "destructive"
            });
            return;
          }
          // For other errors, show error
          setCameraError("Image scan error: " + (err.message || err.name));
          setCameraErrorDetail(err.message || String(err));
          // Log error for debugging
          // eslint-disable-next-line no-console
          console.error('Image QR scan error:', err);
        }
      };
      img.onerror = (e) => {
        toast({
          title: "Image Load Error",
          description: "Could not load the selected image.",
          variant: "destructive"
        });
      };
    };
    reader.readAsDataURL(file);
  };

  const processScannedData = () => {
    if (!scannedData) return;
    if (scannedData.startsWith('0x') && scannedData.length === 42) {
      navigate(`/send?address=${scannedData}`);
    } else if (scannedData.startsWith('ethereum:')) {
      const addressMatch = scannedData.match(/ethereum:([0-9a-fA-F]{40})/);
      if (addressMatch) {
        navigate(`/send?address=0x${addressMatch[1]}`);
      }
    } else {
      toast({
        title: "Invalid Format",
        description: "QR code doesn't contain a valid address",
        variant: "destructive"
      });
    }
  };

  const copyScannedAddress = () => {
    if (scannedData) {
      navigator.clipboard.writeText(scannedData);
      toast({
        title: "Copied!",
        description: "Address copied to clipboard",
      });
    }
  };

  // Always cleanup and navigate on back
  const handleBack = () => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
    codeReaderRef.current = null;
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-primary/10 pb-20">
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleBack}
            variant="ghost"
            size="icon"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Scan QR Code</h1>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>QR Code Scanner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* HTTPS Warning */}
            {!isHttps && (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center space-x-2 text-yellow-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">HTTPS Required</span>
                </div>
                <p className="text-sm text-yellow-600/80 mt-1">
                  Camera access requires HTTPS. Please access this site via HTTPS to use the camera scanner.
                </p>
              </div>
            )}

            {/* Camera Permission Status */}
            {cameraPermission === 'denied' && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center space-x-2 text-red-600">
                  <Camera className="w-4 h-4" />
                  <span className="font-medium">Camera Permission Denied</span>
                </div>
                <p className="text-sm text-red-600/80 mt-1">
                  Please enable camera access in your browser settings to use the scanner.
                </p>
              </div>
            )}

            <div className="aspect-square bg-muted/20 rounded-lg flex items-center justify-center border-2 border-dashed border-muted">
              <div className="text-center space-y-4 w-full">
                {isCameraActive && !cameraError && (
                  <video ref={videoRef} style={{ width: '100%' }} autoPlay muted playsInline />
                )}
                {cameraError && (
                  <div className="text-red-500 text-sm">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-medium">{cameraError}</span>
                    </div>
                    {cameraErrorDetail && (
                      <div className="text-xs text-muted-foreground mt-1 mb-3">{cameraErrorDetail}</div>
                    )}
                    <Button 
                      onClick={() => { 
                        setCameraError(""); 
                        setCameraErrorDetail(""); 
                        setIsCameraActive(true); 
                      }} 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                    >
                      Retry Camera
                    </Button>
                  </div>
                )}
                <Button onClick={() => setIsCameraActive(!isCameraActive)} variant="outline" size="sm">
                  {isCameraActive ? "Stop Camera" : "Start Camera"}
                </Button>
                <div className="mt-2">
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
                    Upload QR Image
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            </div>
            {scannedData && (
              <div className="p-4 bg-primary/10 rounded-md border border-primary/20">
                <h3 className="font-medium text-primary mb-2">Scanned Result</h3>
                <code className="text-sm break-all block mb-3">{scannedData}</code>
                <div className="flex space-x-2">
                  <Button onClick={processScannedData} variant="hero" size="sm">
                    Use This Address
                  </Button>
                  <Button onClick={copyScannedAddress} variant="outline" size="sm">
                    Copy Address
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="p-4 bg-muted/50 rounded-md">
          <h3 className="font-medium mb-2">📱 Supported Formats</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Ethereum addresses (0x...)</li>
            <li>• Ethereum payment URIs (ethereum:0x...)</li>
            <li>• Wallet connect QR codes</li>
            <li>• Most crypto wallet QR formats</li>
          </ul>
        </div>
      </div>

      <BottomNavigation currentPage="scan" />
      <CameraDebug />
    </div>
  );
};

export default Scan;