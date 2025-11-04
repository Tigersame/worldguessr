import User from '../models/User.js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { secret, walletAddress } = req.body;

  // Validate secret
  if (!secret || typeof secret !== 'string') {
    return res.status(400).json({ message: 'Invalid secret' });
  }

  // Validate wallet address
  if (!walletAddress || typeof walletAddress !== 'string') {
    return res.status(400).json({ message: 'Wallet address is required' });
  }

  // Basic Ethereum address validation
  if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
    return res.status(400).json({ message: 'Invalid wallet address format' });
  }

  try {
    // Find user by secret
    const user = await User.findOne({ secret });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update wallet address
    await User.updateOne(
      { secret },
      { $set: { walletAddress: walletAddress.toLowerCase() } } // Store lowercase for consistency
    );

    return res.status(200).json({
      success: true,
      message: 'Wallet address updated successfully',
      walletAddress: walletAddress.toLowerCase()
    });

  } catch (error) {
    console.error('Set wallet address error:', error);
    return res.status(500).json({ 
      message: 'An error occurred while setting wallet address',
      error: error.message 
    });
  }
}

