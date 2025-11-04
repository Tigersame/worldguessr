import { createPublicClient, http, formatEther } from 'viem';
import { base } from 'viem/chains';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// Base chain configuration
const BASE_CHAIN_ID = 8453;

// Create public client for Base network
const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

// Check if wallet is available (Coinbase Wallet or MetaMask)
const getWalletProvider = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    // Check for Coinbase Wallet first (preferred)
    if (window.coinbaseWalletExtension) {
      return window.coinbaseWalletExtension;
    }
    
    // Check for MetaMask or other EIP-1193 providers
    // Use a try-catch to handle cases where ethereum is read-only
    if (window.ethereum) {
      // Check if it's a valid provider object
      if (typeof window.ethereum.request === 'function') {
        return window.ethereum;
      }
    }
  } catch (error) {
    // Silently handle conflicts between wallet extensions
    console.warn('[Base Wallet] Wallet provider conflict detected:', error.message);
  }
  
  return null;
};

export function useBaseWallet() {
  const [account, setAccount] = useState(null);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Check for existing connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      const provider = getWalletProvider();
      if (!provider) return;

      try {
        const accounts = await provider.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
          const connectedAddress = accounts[0];
          setAddress(connectedAddress);
          setIsConnected(true);
          setAccount(connectedAddress);
          
          // Check if we're on Base network
          const chainId = await provider.request({ method: 'eth_chainId' });
          if (parseInt(chainId, 16) !== BASE_CHAIN_ID) {
            toast.warning('Please switch to Base network');
          }
          
          // Fetch balance
          try {
            const bal = await publicClient.getBalance({ address: connectedAddress });
            setBalance(formatEther(bal));
          } catch (err) {
            console.error('[Base Wallet] Balance fetch error:', err);
          }
        }
      } catch (error) {
        console.error('[Base Wallet] Connection check error:', error);
      }
    };

    checkConnection();

    // Listen for account changes
    const provider = getWalletProvider();
    if (provider) {
      const handleAccountsChanged = (accounts) => {
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
          setAccount(accounts[0]);
          setIsConnected(true);
        } else {
          setAddress(null);
          setAccount(null);
          setIsConnected(false);
          setBalance(null);
        }
      };

      provider.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, []);

  // Update balance periodically when connected
  useEffect(() => {
    if (!address || !isConnected) return;

    const fetchBalance = async () => {
      try {
        const bal = await publicClient.getBalance({ address });
        setBalance(formatEther(bal));
      } catch (error) {
        console.error('[Base Wallet] Balance fetch error:', error);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [address, isConnected]);

  const connect = async () => {
    const provider = getWalletProvider();
    if (!provider) {
      toast.error('No wallet found. Please install Coinbase Wallet or MetaMask.');
      return;
    }

    setIsConnecting(true);
    try {
      // Request account access
      const accounts = await provider.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts && accounts.length > 0) {
        const connectedAddress = accounts[0];
        
        // Check if we're on Base network, switch if not
        const chainId = await provider.request({ method: 'eth_chainId' });
        if (parseInt(chainId, 16) !== BASE_CHAIN_ID) {
          try {
            await provider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${BASE_CHAIN_ID.toString(16)}` }],
            });
          } catch (switchError) {
            // If chain doesn't exist, add it
            if (switchError.code === 4902) {
              await provider.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: `0x${BASE_CHAIN_ID.toString(16)}`,
                  chainName: 'Base',
                  nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18,
                  },
                  rpcUrls: ['https://mainnet.base.org'],
                  blockExplorerUrls: ['https://basescan.org'],
                }],
              });
            } else {
              throw switchError;
            }
          }
        }
        
        setAddress(connectedAddress);
        setIsConnected(true);
        setAccount(connectedAddress);
        toast.success('Wallet connected successfully!');
        
        // Fetch balance
        try {
          const bal = await publicClient.getBalance({ address: connectedAddress });
          setBalance(formatEther(bal));
        } catch (err) {
          console.error('[Base Wallet] Balance fetch error:', err);
        }
      }
    } catch (error) {
      console.error('[Base Wallet] Connection error:', error);
      if (error.code === 4001) {
        toast.error('User rejected the connection request');
      } else {
        toast.error(error.message || 'Failed to connect wallet');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    // Note: Most wallets don't support programmatic disconnection
    // We'll just clear local state
    setAddress(null);
    setAccount(null);
    setIsConnected(false);
    setBalance(null);
    toast.success('Wallet disconnected');
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return {
    account,
    address,
    balance,
    isConnecting,
    isConnected,
    connect,
    disconnect,
    formatAddress,
  };
}

