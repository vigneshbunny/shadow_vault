# Shadow Vault

**The most secure and private cryptocurrency wallet. Zero tracking, complete anonymity, full sovereignty.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

## Features

- **Military-Grade Encryption** - AES-256 encryption protects all sensitive data
- **No Tracking** - Zero analytics, logs, or user behavior tracking
- **Local Storage Only** - All data stored locally on your device, never on servers
- **Self-Custody** - You own and control your private keys completely
- **Secure Authentication** - Local password protection with secure verification
- **Data Destruction** - Permanent data clearing on logout for maximum security
- **Mobile-First Design** - Optimized for mobile devices with responsive UI
- **Modern UI** - Beautiful, intuitive interface built with shadcn/ui and Tailwind CSS

## Live Demo

Visit the live application: [shadow-vault-two.vercel.app](https://shadow-vault-two.vercel.app)

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **QR Code**: @zxing/browser, html5-qrcode
- **Crypto**: Web Crypto API
- **Routing**: React Router DOM

## Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/vigneshbunny/shadow_vault.git

# Navigate to project directory
cd shadow_vault

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Application pages
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and configurations
├── assets/        # Static assets (images, icons)
└── ui/            # shadcn/ui components
```

## Security Features

### Privacy by Design
- **Zero Server Communication** - All operations happen locally
- **No Analytics** - No tracking or data collection
- **Local Storage** - All data stays on your device
- **Self-Custody** - You control your private keys

### Encryption & Security
- **AES-256 Encryption** - Military-grade encryption for sensitive data
- **Secure Key Generation** - Cryptographically secure random generation
- **Password Protection** - Local password for accessing sensitive data
- **Secure Logout** - Complete data destruction on logout

## Supported Networks

- **Ethereum (ETH)** - Mainnet and testnets
- **Bitcoin (BTC)** - Mainnet and testnets
- **Polygon (MATIC)** - Polygon network
- **Binance Smart Chain (BNB)** - BSC network

## Usage

1. **Create Wallet** - Generate a new wallet with secure seed phrase
2. **Import Wallet** - Import existing wallets using private key or seed phrase
3. **Send Crypto** - Send transactions with QR code scanning
4. **Receive Crypto** - Generate QR codes for receiving payments
5. **View Balances** - Real-time balance tracking with USD values
6. **Security Settings** - Manage wallet security and backup options

## Contributing

We welcome contributions! Please read our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use conventional commit messages
- Ensure all tests pass
- Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

**Important**: This is experimental software. Use at your own risk. Always verify your transactions and keep your private keys secure. The developers are not responsible for any loss of funds.

## Links

- **Live Demo**: [shadow-vault-two.vercel.app](https://shadow-vault-two.vercel.app)
- **GitHub Repository**: [github.com/vigneshbunny/shadow_vault](https://github.com/vigneshbunny/shadow_vault)
- **Issues**: [GitHub Issues](https://github.com/vigneshbunny/shadow_vault/issues)

## Acknowledgments

- Built with [React](https://reactjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**Made with love for privacy and security**
