import User from '../models/User.js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { secret, recipientUsername, amount } = req.body;

  // Validate inputs
  if (!secret || typeof secret !== 'string') {
    return res.status(400).json({ message: 'Invalid secret' });
  }

  if (!recipientUsername || typeof recipientUsername !== 'string') {
    return res.status(400).json({ message: 'Recipient username is required' });
  }

  if (!amount || typeof amount !== 'number' || amount <= 0 || !Number.isInteger(amount)) {
    return res.status(400).json({ message: 'Valid token amount is required' });
  }

  try {
    // Find sender user
    const sender = await User.findOne({ secret });
    if (!sender) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if sender has enough tokens
    if ((sender.totalTokens || 0) < amount) {
      return res.status(400).json({ message: 'Insufficient token balance' });
    }

    // Prevent self-transfer
    if (sender.username === recipientUsername) {
      return res.status(400).json({ message: 'Cannot transfer tokens to yourself' });
    }

    // Find recipient user
    const recipient = await User.findOne({ username: recipientUsername });
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // Perform transfer in a transaction-like operation
    await User.updateOne(
      { secret },
      { $inc: { totalTokens: -amount } }
    );

    await User.updateOne(
      { username: recipientUsername },
      { $inc: { totalTokens: amount } }
    );

    // Return updated balance
    const updatedSender = await User.findOne({ secret });
    
    return res.status(200).json({
      success: true,
      message: `Successfully transferred ${amount} tokens to ${recipientUsername}`,
      newBalance: updatedSender.totalTokens || 0
    });

  } catch (error) {
    console.error('Token transfer error:', error);
    return res.status(500).json({ 
      message: 'An error occurred while transferring tokens',
      error: error.message 
    });
  }
}

