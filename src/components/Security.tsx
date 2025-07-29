import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, Server, Key, Trash2 } from "lucide-react";

const Security = () => {
  const securityFeatures = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Military-Grade Encryption",
      description: "AES-256 encryption protects all sensitive data"
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "No Tracking",
      description: "Zero analytics, logs, or user behavior tracking"
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: "Local Storage Only",
      description: "All data stored locally on your device, never on servers"
    },
    {
      icon: <Key className="w-6 h-6" />,
      title: "Self-Custody",
      description: "You own and control your private keys completely"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Secure Authentication",
      description: "Local password protection with secure verification"
    },
    {
      icon: <Trash2 className="w-6 h-6" />,
      title: "Data Destruction",
      description: "Permanent data clearing on logout for maximum security"
    }
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Security
            </span>{" "}
            <span className="text-foreground">First Design</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Built from the ground up with paranoid-level security practices. 
            Your privacy and anonymity are not just features—they're guarantees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="mb-4 flex justify-center">
                <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center bg-gradient-card rounded-xl p-8 border border-border/50">
          <h3 className="text-2xl font-bold mb-4">Open Source Transparency</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Every line of code is open for inspection. Security through transparency, 
            not obscurity. Join the community of privacy advocates building the future of digital sovereignty.
          </p>
          <Button variant="outline" size="lg" asChild>
            <a href="https://github.com/vigneshbunny/shadow_vault" target="_blank" rel="noopener noreferrer">
              Audit Our Code on GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Security;