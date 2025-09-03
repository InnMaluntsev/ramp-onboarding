# Fireblocks Order Capabilities Onboarding Guide

Fireblocks Network Link gives service providers a direct path into one of the largest institutional ecosystems. By integrating seamlessly, providers can position themselves as partners of choice for over 2,400 money transmitters, market makers, trading desks, hedge funds, brokerages, custodians, and banks already on the network, and capture the growing wave of participants actively seeking trusted service partners.

With Network Link, providers can deliver a wide range of capabilities, including stablecoin-based payments, cryptocurrency trading, and RWAs- including, but not limited to: 

- **Exchanges**: Including prefunded and off-exchange trading
- **On and Off-ramps**: Digital asset conversion between fiat currencies and stablecoins, including first and third-party payments
- **Swaps between digital assets**: Swap stablecoins and cryptocurrencies via DeFi or CeFi mechanisms
- **Tokenization**: Issuance and management of stablecoins or tokenized assets
  
This enables Providers and the Fireblocks Network users to connect to liquidity providers and business opportunities.

## ❓ Why Build Order Capabilities with Fireblocks?

### Business Benefits
- **Direct Access to Institutional Demand**: Tap into a growing network of institutional clients through a single, streamlined integration.
- **Enhanced Visibility**: Get discovered by potential clients within the Fireblocks ecosystem, driving new business opportunities.
- **Operational Streamlining**: Contribute to reduced client onboarding times and optimized operational workflows for new clients via
Fireblocks.
- **Integrated Workflows**: Benefit from unified workflows for trade tracking, payments, and reconciliation processes.
- **Built In Compliance & Governance**: Rely on Fireblocks’ robust frameworks for wallet verification, Travel Rule, and counterparty governance.

## 🚀 Features

- **Step-by-Step Learning Path**: 4 structured steps from understanding to implementation
- **Interactive Knowledge Check**: Quiz system to validate understanding of RAMP concepts
- **Authentication & Security**: Comprehensive security implementation guidance
- **API Response Builder**: Interactive tool to build and validate RAMP API responses
- **Responsive Design**: Works seamlessly across desktop and mobile

## 📋 Learning Path

### Step 1: Understanding Order Capabilities & What You'll Build
Learn about Fireblocks Order capabilities and payment use cases, including:
- Fiat-to-crypto (On-ramp) services
- Crypto-to-fiat (Off-ramp) services  
- Crypto-to-crypto bridging
- Order flows and pricing methods
- Required API endpoints

### Step 2: Order Capabilities Knowledge Check
Interactive quiz covering:
- Orders fundamentals (on-ramp vs off-ramp)
- Technical concepts (bucket assets, account types, order flows)
- Implementation requirements
- Compliance and security basics

### Step 3: Authentication & Signature
Master API security requirements:
- Required security headers
- Signature calculation process
- Cryptographic algorithms
- Security best practices
- Interactive authentication quiz

### Step 4: Build API Responses
Interactive API response builder:
- Core endpoint responses
- RAMP-specific endpoints
- Real-time validation
- Example responses and patterns

## 🛠 Technology Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Components**: React with hooks
- **Deployment**: GitHub Pages compatible

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ramp-onboarding
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

```bash
npm run build
npm run export
```

## 📁 Project Structure

```
ramp-onboarding/
├── src/
│   ├── app/
│   │   ├── components/          # React components
│   │   ├── labs/               # Lab routing
│   │   └── layout.tsx          # App layout
│   ├── config.ts               # Application configuration
│   └── types.ts                # TypeScript type definitions
├── public/
│   └── steps/
│       └── ramp-onboarding/    # Markdown content files
└── out/                        # Static export output (after build)
```

## 🔧 Configuration

### Lab Configuration

The main lab configuration is in `src/config.ts`:

```typescript
export const labsConfig: Record<string, LabConfig> = {
  "ramp-onboarding": {
    id: "ramp-onboarding",
    title: "RAMP Onboarding Guide",
    description: "Learn to implement Fireblocks RAMP capabilities...",
    steps: [
      { id: 1, title: "Understanding RAMP & What You'll Build", file: "ramp-onboarding/step1.md" },
      { id: 2, title: "RAMP Knowledge Check", file: "ramp-onboarding/step2.md" },
      { id: 3, title: "Authentication & Signature", file: "ramp-onboarding/step3.md" },
      { id: 4, title: "Build API Responses", file: "ramp-onboarding/step4.md" },
    ]
  }
};
```

### Adding New Quiz Questions

Update quiz questions in the respective components:
- RAMP quiz: `src/app/components/InteractiveQuiz.tsx`
- Auth quiz: `src/app/components/AuthSignatureQuiz.tsx`

## 🎯 Key Features

### Interactive Learning
- Progressive step-based learning
- Knowledge validation through quizzes
- Hands-on API response building

### RAMP-Specific Content
- On-ramp and off-ramp implementations
- Crypto-to-crypto bridging
- Institutional payment flows
- Compliance requirements
- Security best practices

### Developer-Friendly
- TypeScript for type safety
- Component-based architecture
- Responsive design patterns
- GitHub Pages deployment ready

## 📚 Content Management

### Step Content Files
Step content is stored in markdown files under `public/steps/ramp-onboarding/`:
- `step1.md` - Understanding RAMP & What You'll Build
- `step2.md` - RAMP Knowledge Check
- `step3.md` - Authentication & Signature
- `step4.md` - Build API Responses

### Updating Content
1. Edit the relevant markdown file
2. Run the development server to see changes
3. Build and deploy for production updates

## 🔍 API Integration

The application is designed to work with the Fireblocks Provider Connectivity API v2:

### Core Endpoints
- `GET /capabilities` - Server capabilities
- `GET /accounts` - Account management
- `GET /accounts/{id}/balances` - Balance queries
- `GET /accounts/{id}/ramps` - RAMP operations

### Implementation Examples
See Step 4 for detailed implementation examples and the interactive API builder.

## 🚀 Deployment

### GitHub Pages Deployment
The application supports static export for GitHub Pages:

```bash
npm run build
npm run export
```

The output will be in the `out/` directory, ready for deployment.

### Configuration for Deployment
Update `src/config.ts` for your deployment environment:

```typescript
export const generalConfig: GeneralConfig = {
  companyName: "Fireblocks",
  basePath: isDev ? "" : "/your-repo-name", // Update for GitHub Pages
};
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the Fireblocks developer resources. See the Fireblocks documentation for licensing terms.

## 🆘 Support

For questions about RAMP integration:
- Review the [Fireblocks API Documentation](https://fireblocks.github.io/fireblocks-network-link/v2/docs.html)
- Use the [API Validation Tool](https://github.com/fireblocks/fireblocks-network-link/tree/main/v2/api-validator)
- Contact Fireblocks developer support

## 🗺 Roadmap

- [ ] Advanced RAMP features documentation
- [ ] Extended compliance guidance
- [ ] Multi-language support
- [ ] Video tutorials integration
- [ ] Advanced API testing tools

## 📊 RAMP Use Cases

This guide covers the following RAMP implementations:

### On-Ramp (Fiat → Crypto)
- Bank transfers to cryptocurrency
- Credit card to crypto conversion
- Wire transfer processing
- Payment method integration

### Off-Ramp (Crypto → Fiat)
- Cryptocurrency to bank account
- Instant cash-out services
- Multi-currency support
- Compliance reporting

### Crypto-to-Crypto Bridging
- Cross-chain asset conversion
- Multi-blockchain support
- Liquidity optimization
- Real-time rate discovery

### Order Flows
- **Prefunded**: Use existing balance for conversion
- **Delivery (DVP)**: Fund on demand, convert in real-time
- **Convert & Hold**: Portfolio management and rebalancing

---

**Ready to transform payment flows?** Start your RAMP integration journey today and join the growing network of providers enabling seamless crypto-fiat conversions for institutional clients worldwide!
