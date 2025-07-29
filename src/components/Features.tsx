import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  Key, 
  Download, 
  Upload, 
  Server, 
  Lock, 
  Eye, 
  Trash2,
  Settings,
  Github
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "EVM Wallet Creation",
      description: "Generate secure wallets for Ethereum and all EVM-compatible chains with military-grade encryption."
    },
    {
      icon: <Key className="w-8 h-8 text-primary" />,
      title: "Private Keys & Seed Phrases",
      description: "Full control over your private keys and mnemonic phrases. Never stored on our servers."
    },
    {
      icon: <Download className="w-8 h-8 text-primary" />,
      title: "Import Wallets",
      description: "Seamlessly import existing wallets using private keys or seed phrases from any source."
    },
    {
      icon: <Upload className="w-8 h-8 text-primary" />,
      title: "Export Functionality",
      description: "Export your wallets anytime, anywhere. Your data remains yours forever."
    },
    {
      icon: <Lock className="w-8 h-8 text-primary" />,
      title: "Local Password Protection",
      description: "Secure local authentication with password protection for quick access verification."
    },
    {
      icon: <Trash2 className="w-8 h-8 text-primary" />,
      title: "Permanent Data Clearing",
      description: "Logout permanently erases all local transaction data and sensitive information."
    },
    {
      icon: <Server className="w-8 h-8 text-primary" />,
      title: "Custom RPC Support",
      description: "Connect to your own RPC endpoints for maximum privacy and customization."
    },
    {
      icon: <Eye className="w-8 h-8 text-primary" />,
      title: "Zero Tracking",
      description: "No analytics, no tracking, no data collection. Complete privacy guaranteed."
    },
    {
      icon: <Settings className="w-8 h-8 text-primary" />,
      title: "Full Customization",
      description: "Customize every aspect of your wallet experience with advanced configuration options."
    },
    {
      icon: <Github className="w-8 h-8 text-primary" />,
      title: "Open Source",
      description: "Fully open source and auditable. Community-driven development and security."
    }
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-background to-background/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Uncompromising Security Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every feature designed with privacy, security, and user sovereignty in mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-card group"
            >
              <CardHeader className="pb-4">
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-semibold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;