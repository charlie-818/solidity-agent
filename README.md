# Real Estate Portfolio Smart Contract Agent

A comprehensive solution for creating, managing, and interacting with smart contracts for real estate portfolios. This agent helps users register properties on the blockchain as NFTs, track value changes, manage rental status, and transfer ownership.

## Project Structure

The project is organized into two main parts:

1. **Smart Contract (Backend)**
   - Solidity contract for property management
   - Hardhat environment for development, testing, and deployment
   - Scripts for deploying and interacting with the contract

2. **Web Application (Frontend)**
   - React-based interface for interacting with the smart contract
   - Web3 integration for wallet connection
   - UI for property registration, viewing, and management

## Features

- **Property Registration**: Register properties with detailed information
- **Property Valuation**: Track purchase price and current valuation
- **Rental Management**: Mark properties as rented and track rental income
- **Ownership Transfer**: Transfer property ownership via NFT standards
- **Portfolio View**: See all properties in a portfolio

## Technical Details

### Smart Contract

The `RealEstatePortfolio` contract is built on the ERC721 NFT standard with the following features:

- Extends OpenZeppelin's ERC721URIStorage for metadata management
- Properties represented as unique tokens with comprehensive metadata
- Role-based access control for property management
- Events for tracking property registration, updates, sales, and rental changes

### Frontend Application

- React-based application with NextUI components
- Ethers.js for blockchain interaction
- Web3Modal for wallet connection
- Responsive design for mobile and desktop use

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MetaMask or another Ethereum wallet

### Local Development

1. **Clone the repository**

```bash
git clone <repository-url>
cd real-estate-portfolio-agent
```

2. **Install dependencies**

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env
# Edit .env with your values
```

4. **Compile and deploy the smart contract (local)**

```bash
npx hardhat compile
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

5. **Start the frontend**

```bash
cd frontend
npm start
```

### Deploying to Test Networks

1. **Deploy to Sepolia testnet**

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

2. **Build frontend for production**

```bash
cd frontend
npm run build
```

## Usage Guide

1. **Connect Wallet**: Connect your MetaMask or other Ethereum wallet
2. **Connect to Contract**: Enter the deployed contract address
3. **Register Property**: Fill in property details and register it on the blockchain
4. **View Property**: View property details by entering the token ID
5. **Manage Property**: Update values, set rental status, or transfer ownership

## Smart Contract API

The main functions available in the smart contract:

- `registerProperty`: Register a new property as an NFT
- `updateProperty`: Update property information
- `setRentalStatus`: Set rental status and income
- `getPropertyDetails`: Get detailed property information
- `transferFrom`: Transfer property ownership (standard NFT transfer)

## Testing

Run the test suite to verify contract functionality:

```bash
npx hardhat test
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenZeppelin for secure smart contract libraries
- NextUI for React components
- Hardhat for the Ethereum development environment 