import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Github, Shield, Terminal } from "lucide-react";

const GetStarted = () => {
  const steps = [
    {
      step: "01",
      title: "Download Shadow Vault",
      description: "Get the latest release for your operating system"
    },
    {
      step: "02", 
      title: "Run Locally",
      description: "Launch the application on your secure device"
    },
    {
      step: "03",
      title: "Create or Import",
      description: "Generate new wallets or import existing ones"
    },
    {
      step: "04",
      title: "Stay Anonymous",
      description: "Enjoy complete privacy and security"
    }
  ];

  return (
    <section className="py-24 px-6 bg-gradient-to-t from-background to-background/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get Started with{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Shadow Vault
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Begin your journey to complete financial privacy in minutes. 
            No accounts, no tracking, no compromises.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="mb-6 relative">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                  {step.step}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent -translate-x-8" />
                )}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Download Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Download className="w-6 h-6 text-primary" />
                Download Release
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Get the latest stable version of Shadow Vault for immediate use. 
                Pre-built and ready to secure your crypto assets.
              </p>
              <Button variant="hero" className="w-full" asChild>
                <a href="https://github.com/vigneshbunny/shadow_vault" target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 mr-2" />
                  Download v1.0.0
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Terminal className="w-6 h-6 text-primary" />
                Build from Source
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Compile Shadow Vault yourself for maximum trust and security. 
                Perfect for advanced users and security audits.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <a href="https://github.com/vigneshbunny/shadow_vault" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  View Source Code
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <div className="mt-12 p-6 rounded-xl bg-primary/10 border border-primary/20">
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-primary mb-2">Security Notice</h4>
              <p className="text-sm text-muted-foreground">
                Always verify downloads using our GPG signatures. Never download Shadow Vault from unofficial sources. 
                Your security depends on it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetStarted;