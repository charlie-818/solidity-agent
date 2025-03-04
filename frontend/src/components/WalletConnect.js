import React, { useState, useEffect } from 'react';
import { Button, Chip } from '@nextui-org/react';
import { ethers } from 'ethers';

function WalletConnect({ onConnected }) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (window.ethereum && window.ethereum.selectedAddress) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        
        setWalletAddress(address);
        setIsConnected(true);
        onConnected && onConnected(true, address);
      }
    };

    checkConnection().catch(console.error);

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          onConnected && onConnected(true, accounts[0]);
        } else {
          setWalletAddress(null);
          setIsConnected(false);
          onConnected && onConnected(false, null);
        }
      });
    }

    return () => {
      // Clean up event listener
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
      }
    };
  }, [onConnected]);

  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error('No Ethereum wallet detected. Please install MetaMask or another wallet.');
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length === 0) {
        throw new Error('No accounts found. Please unlock your wallet and try again.');
      }

      setWalletAddress(accounts[0]);
      setIsConnected(true);
      onConnected && onConnected(true, accounts[0]);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {isConnected ? (
        <div className="flex items-center gap-2">
          <Chip color="success" variant="flat">Connected</Chip>
          <Chip variant="bordered">{truncateAddress(walletAddress)}</Chip>
        </div>
      ) : (
        <>
          <Button 
            color="primary" 
            onClick={connectWallet} 
            isLoading={isLoading}
          >
            Connect Wallet
          </Button>
          {error && <p className="text-danger text-sm">{error}</p>}
        </>
      )}
    </div>
  );
}

export default WalletConnect; 