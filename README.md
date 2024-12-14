# MicroLend - Decentralized Microlending Platform

[![Vercel Status]()](https://decentralized-bitcoin-backed-microlending.vercel.app/)

MicroLend is a decentralized microlending platform built on the Stacks blockchain, enabling peer-to-peer lending with collateralized loans. The platform provides a secure, transparent, and efficient way to facilitate lending and borrowing of digital assets.

## Features

- **User Dashboard**

  - Comprehensive overview of loans (active, pending, liquidated)
  - Reputation metrics tracking
  - Total borrowed amount monitoring

- **Loan Management**

  - Intuitive loan request creation
  - Real-time validation
  - Active loans tracking

- **Collateral Management**

  - Whitelisted collateral assets
  - Dynamic asset price updates
  - Liquidation threshold monitoring

- **Platform Security**
  - Emergency stop mechanism
  - Role-based access control
  - Secure smart contract integration

## Technology Stack

- **Frontend**

  - React with TypeScript
  - Tailwind CSS for styling
  - Lucide React for icons
  - Vite for build tooling

- **Blockchain**
  - Stacks blockchain
  - Clarity smart contracts
  - Hiro Wallet integration

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Hiro Wallet browser extension

### Installation

1. Clone the repository:

   ```bash
   https://github.com/emmanuelist/decentralized-bitcoin-backed-microlending.git
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Smart Contract Integration

The platform interacts with the following main smart contract functions:

- `create-loan-request`: Create new loan requests
- `liquidate-loan`: Handle loan liquidations
- `update-asset-price`: Update collateral asset prices
- `toggle-emergency-stop`: Emergency platform control

For detailed smart contract documentation, see [Smart Contract Documentation](docs/SMART_CONTRACT.md).

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## Security

For security concerns, please review our [Security Policy](SECURITY.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the team at emmanuelpaul152@gmail.com

## Acknowledgments

- Stacks Foundation
- Hiro Systems
- Open source community

## Deployment

The application is deployed on Vercel. Visit [MicroLend Platform](https://decentralized-bitcoin-backed-microlending.vercel.app/) to access the live version.
