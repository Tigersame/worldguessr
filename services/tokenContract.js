import { createWalletClient, createPublicClient, http, parseEther, formatEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';

// Contract ABI (ERC20 + custom functions)
const REWARD_TOKEN_ABI = [
  {
    inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'recipients', type: 'address[]' },
      { name: 'amounts', type: 'uint256[]' },
    ],
    name: 'batchMint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

// Configuration
const PRIVATE_KEY = process.env.TOKEN_PRIVATE_KEY || '0x6065576b9f1277658199f51dfd4460d390d76c8d7a98ecd928cd3cd2d54569b2';
let CONTRACT_ADDRESS = process.env.REWARD_TOKEN_ADDRESS || ''; // Will be set after deployment
const REWARD_AMOUNT_PER_1000_POINTS = parseEther('1'); // 1 token per 1000 points

// Create wallet client
const account = privateKeyToAccount(PRIVATE_KEY);
const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(),
});

// Public client for reading
const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

/**
 * Get token balance for an address
 * @param {string} address - Wallet address
 * @returns {Promise<string>} Balance in tokens (formatted)
 */
export async function getTokenBalance(address) {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Reward token contract address not set');
  }

  try {
    const balance = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: REWARD_TOKEN_ABI,
      functionName: 'balanceOf',
      args: [address],
    });

    return formatEther(balance);
  } catch (error) {
    console.error('[Token Contract] Error getting balance:', error);
    throw error;
  }
}

/**
 * Transfer tokens to a user
 * @param {string} toAddress - Recipient wallet address
 * @param {number} points - Points earned (will calculate tokens: 1 token per 1000 points)
 * @returns {Promise<string>} Transaction hash
 */
export async function distributeTokens(toAddress, points) {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Reward token contract address not set');
  }

  if (!toAddress || !toAddress.startsWith('0x')) {
    throw new Error('Invalid wallet address');
  }

  // Calculate tokens: 1 token per 1000 points
  const tokens = Math.floor(points / 1000);
  if (tokens <= 0) {
    return null; // No tokens to distribute
  }

  const amount = parseEther(tokens.toString());

  try {
    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: REWARD_TOKEN_ABI,
      functionName: 'transfer',
      args: [toAddress, amount],
    });

    console.log(`[Token Contract] Distributed ${tokens} tokens to ${toAddress}, tx: ${hash}`);
    return hash;
  } catch (error) {
    console.error('[Token Contract] Error distributing tokens:', error);
    throw error;
  }
}

/**
 * Batch distribute tokens to multiple users
 * @param {Array<{address: string, points: number}>} rewards - Array of reward objects
 * @returns {Promise<string>} Transaction hash
 */
export async function batchDistributeTokens(rewards) {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Reward token contract address not set');
  }

  const recipients = [];
  const amounts = [];

  for (const reward of rewards) {
    if (!reward.address || !reward.address.startsWith('0x')) {
      continue; // Skip invalid addresses
    }

    const tokens = Math.floor(reward.points / 1000);
    if (tokens > 0) {
      recipients.push(reward.address);
      amounts.push(parseEther(tokens.toString()));
    }
  }

  if (recipients.length === 0) {
    return null; // No valid rewards
  }

  try {
    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: REWARD_TOKEN_ABI,
      functionName: 'batchMint',
      args: [recipients, amounts],
    });

    console.log(`[Token Contract] Batch distributed tokens to ${recipients.length} users, tx: ${hash}`);
    return hash;
  } catch (error) {
    console.error('[Token Contract] Error batch distributing tokens:', error);
    throw error;
  }
}

/**
 * Get contract total supply
 * @returns {Promise<string>} Total supply in tokens (formatted)
 */
export async function getTotalSupply() {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Reward token contract address not set');
  }

  try {
    const supply = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: REWARD_TOKEN_ABI,
      functionName: 'totalSupply',
    });

    return formatEther(supply);
  } catch (error) {
    console.error('[Token Contract] Error getting total supply:', error);
    throw error;
  }
}

/**
 * Set the contract address (call after deployment)
 * @param {string} address - Contract address
 */
export function setContractAddress(address) {
  CONTRACT_ADDRESS = address;
}

export default {
  getTokenBalance,
  distributeTokens,
  batchDistributeTokens,
  getTotalSupply,
  setContractAddress,
};

