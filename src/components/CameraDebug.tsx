import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Camera, CheckCircle, XCircle } from 'lucide-react';

const CameraDebug = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const info = {
      userAgent: navigator.userAgent,
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      port: window.location.port,
      isSecure: window.location.protocol === 'https:',
      hasMediaDevices: !!navigator.mediaDevices,
      hasGetUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      hasPermissions: !!navigator.permissions,
      hasQuery: !!(navigator.permissions && navigator.permissions.query),
      timestamp: new Date().toISOString(),
    };

    // Check camera permissions if available
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'camera' as PermissionName })
        .then((permissionStatus) => {
          setDebugInfo({
            ...info,
            cameraPermission: permissionStatus.state,
            cameraPermissionSupported: true,
          });
        })
        .catch((error) => {
          setDebugInfo({
            ...info,
            cameraPermission: 'error',
            cameraPermissionError: error.message,
            cameraPermissionSupported: false,
          });
        });
    } else {
      setDebugInfo({
        ...info,
        cameraPermission: 'not-supported',
        cameraPermissionSupported: false,
      });
    }
  }, []);

  const testCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setDebugInfo(prev => ({
        ...prev,
        cameraTest: 'success',
        cameraTestError: null,
      }));
      // Stop the stream immediately
      stream.getTracks().forEach(track => track.stop());
    } catch (error: any) {
      setDebugInfo(prev => ({
        ...prev,
        cameraTest: 'failed',
        cameraTestError: error.message,
        cameraTestErrorName: error.name,
      }));
    }
  };

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-20 right-4 z-50"
      >
        Debug Camera
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5" />
            <span>Camera Debug Information</span>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="ml-auto"
            >
              ×
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">Environment</h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center space-x-2">
                  <span>Protocol:</span>
                  <Badge variant={debugInfo.isSecure ? "default" : "destructive"}>
                    {debugInfo.protocol}
                  </Badge>
                </div>
                <div>Hostname: {debugInfo.hostname}</div>
                <div>Port: {debugInfo.port || 'default'}</div>
                <div>User Agent: {debugInfo.userAgent?.substring(0, 50)}...</div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Camera Support</h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center space-x-2">
                  <span>MediaDevices:</span>
                  {debugInfo.hasMediaDevices ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span>getUserMedia:</span>
                  {debugInfo.hasGetUserMedia ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span>Permissions API:</span>
                  {debugInfo.hasPermissions ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Camera Permission</h3>
            <div className="flex items-center space-x-2">
              <span>Status:</span>
              <Badge 
                variant={
                  debugInfo.cameraPermission === 'granted' ? 'default' :
                  debugInfo.cameraPermission === 'denied' ? 'destructive' :
                  debugInfo.cameraPermission === 'prompt' ? 'secondary' : 'outline'
                }
              >
                {debugInfo.cameraPermission || 'unknown'}
              </Badge>
            </div>
            {debugInfo.cameraPermissionError && (
              <div className="text-sm text-red-600">
                Error: {debugInfo.cameraPermissionError}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Camera Test</h3>
            <Button onClick={testCamera} variant="outline" size="sm">
              Test Camera Access
            </Button>
            {debugInfo.cameraTest && (
              <div className="flex items-center space-x-2">
                <span>Result:</span>
                {debugInfo.cameraTest === 'success' ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">Success</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-red-600">Failed</span>
                  </>
                )}
              </div>
            )}
            {debugInfo.cameraTestError && (
              <div className="text-sm text-red-600">
                Error: {debugInfo.cameraTestError}
                {debugInfo.cameraTestErrorName && (
                  <div className="text-xs text-muted-foreground">
                    Type: {debugInfo.cameraTestErrorName}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Recommendations</h3>
            <div className="space-y-2 text-sm">
              {!debugInfo.isSecure && (
                <div className="flex items-start space-x-2 p-2 bg-yellow-500/10 rounded">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-yellow-600">HTTPS Required</div>
                    <div className="text-yellow-600/80">
                      Camera access requires HTTPS. Deploy to a secure domain.
                    </div>
                  </div>
                </div>
              )}
              {debugInfo.cameraPermission === 'denied' && (
                <div className="flex items-start space-x-2 p-2 bg-red-500/10 rounded">
                  <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-red-600">Permission Denied</div>
                    <div className="text-red-600/80">
                      Camera permission is denied. Check browser settings.
                    </div>
                  </div>
                </div>
              )}
              {!debugInfo.hasMediaDevices && (
                <div className="flex items-start space-x-2 p-2 bg-red-500/10 rounded">
                  <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-red-600">Not Supported</div>
                    <div className="text-red-600/80">
                      Your browser doesn't support camera access.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            Debug timestamp: {debugInfo.timestamp}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CameraDebug; 