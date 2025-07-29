import { Github, Shield, Twitter, MessageCircle } from "lucide-react";
import shadowVaultLogo from "@/assets/shadow-vault-logo.png";

const Footer = () => {
  const links = {
    project: [
      { name: "Documentation", href: "#" },
      { name: "Releases", href: "#" },
      { name: "Security Audit", href: "#" },
      { name: "Roadmap", href: "#" }
    ],
    community: [
      { name: "GitHub", href: "https://github.com/vigneshbunny/shadow_vault", icon: Github },
      { name: "Discord", href: "#", icon: MessageCircle },
      { name: "Twitter", href: "#", icon: Twitter },
      { name: "Telegram", href: "#", icon: MessageCircle }
    ],
    resources: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Use", href: "#" },
      { name: "Bug Bounty", href: "#" },
      { name: "Support", href: "#" }
    ]
  };

  return (
    <footer className="py-16 px-6 border-t border-border/50 bg-gradient-to-b from-background to-background/80">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src={shadowVaultLogo} alt="Shadow Vault" className="w-8 h-8" />
              <span className="text-xl font-bold">Shadow Vault</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              The most secure and private cryptocurrency wallet. 
              Zero tracking, complete anonymity, full sovereignty.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-primary" />
              <span>Privacy by Design</span>
            </div>
          </div>

          {/* Project Links */}
          <div>
            <h4 className="font-semibold mb-6">Project</h4>
            <ul className="space-y-3">
              {links.project.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h4 className="font-semibold mb-6">Community</h4>
            <ul className="space-y-3">
              {links.community.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-6">Resources</h4>
            <ul className="space-y-3">
              {links.resources.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2025 Shadow Vault. Open source and free forever.
          </div>
          <div className="text-sm text-muted-foreground">
            Built with privacy, security, and sovereignty in mind.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;