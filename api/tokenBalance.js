import User from '../models/User.js';

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

    // Return token balance
    return res.status(200).json({
      totalTokens: user.totalTokens || 0,
      walletAddress: user.walletAddress || null
    });

  } catch (error) {
    console.error('Token balance error:', error);
    return res.status(500).json({ 
      message: 'An error occurred while fetching token balance',
      error: error.message 
    });
  }
}

