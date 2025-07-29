import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, Github } from "lucide-react";
import heroBackground from "@/assets/hero-background.png";
import shadowVaultLogo from "@/assets/shadow-vault-logo.png";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background/80" />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 animate-float">
        <Shield className="w-8 h-8 text-primary/40" />
      </div>
      <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '2s' }}>
        <Lock className="w-6 h-6 text-accent/40" />
      </div>
      <div className="absolute bottom-32 left-20 animate-float" style={{ animationDelay: '4s' }}>
        <Eye className="w-7 h-7 text-primary/30" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <img 
            src={shadowVaultLogo} 
            alt="Shadow Vault" 
            className="w-24 h-24 drop-shadow-2xl animate-glow"
          />
        </div>

        {/* Heading */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
          Shadow Vault
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-4xl mx-auto">
          The Most Secure & Private Crypto Wallet
        </p>
        
        <p className="text-lg text-muted-foreground/80 mb-12 max-w-3xl mx-auto">
          Pure anonymity. Zero tracking. Complete privacy. Your keys, your crypto, your sovereignty.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button variant="hero" size="lg" className="text-lg px-8 py-6" onClick={() => navigate('/launch')}>
            <Shield className="w-5 h-5 mr-2" />
            Launch Shadow Vault
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
            <a href="https://github.com/vigneshbunny" target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5 mr-2" />
              View Source Code
            </a>
          </Button>
        </div>

        {/* Security badges */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            <span>Military-Grade Encryption</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span>Zero Data Collection</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            <span>Complete Anonymity</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;