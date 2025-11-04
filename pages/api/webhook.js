// Webhook handler for Base Mini App
// This endpoint receives events from Base/Farcaster

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const event = req.body;
    
    // Log the webhook event for debugging
    console.log('[Base Webhook] Received event:', event.type || 'unknown');
    
    // Handle different event types from Base/Farcaster
    switch (event.type) {
      case 'user.connected':
        // Handle user connection event
        console.log('[Base Webhook] User connected:', event.data);
        break;
      
      case 'user.disconnected':
        // Handle user disconnection event
        console.log('[Base Webhook] User disconnected:', event.data);
        break;
      
      case 'frame.action':
        // Handle frame action events
        console.log('[Base Webhook] Frame action:', event.data);
        break;
      
      default:
        console.log('[Base Webhook] Unknown event type:', event.type);
    }
    
    // Always return 200 to acknowledge receipt
    res.status(200).json({ success: true, received: true });
  } catch (error) {
    console.error('[Base Webhook] Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

