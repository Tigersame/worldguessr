import User from '../models/User.js';
import { getTokenBalance } from '../services/tokenContract.js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { secret } = req.body;

  // Validate secret
  if (!secret || typeof secret !== 'string') {
    return res.status(400).json({ message: 'Invalid secret' });
  }

  try {
    // Find user by secret
    const user = await User.findOne({ secret });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If no wallet address, return 0
    if (!user.walletAddress) {
      return res.status(200).json({
        walletAddress: null,
        blockchainBalance: '0',
        inGameBalance: user.totalTokens || 0
      });
    }

    // Get blockchain balance
    try {
      const blockchainBalance = await getTokenBalance(user.walletAddress);
      
      return res.status(200).json({
        walletAddress: user.walletAddress,
        blockchainBalance: blockchainBalance,
        inGameBalance: user.totalTokens || 0
      });
    } catch (blockchainError) {
      console.error('[Blockchain] Error fetching balance:', blockchainError);
      // Return in-game balance even if blockchain query fails
      return res.status(200).json({
        walletAddress: user.walletAddress,
        blockchainBalance: '0', // Default to 0 if query fails
        inGameBalance: user.totalTokens || 0,
        error: 'Failed to fetch blockchain balance'
      });
    }

  } catch (error) {
    console.error('Get blockchain balance error:', error);
    return res.status(500).json({ 
      message: 'An error occurred while fetching balance',
      error: error.message 
    });
  }
}

