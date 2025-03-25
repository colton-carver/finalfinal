import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import Stripe from 'stripe';

export default async function handler(req, res) {
  // Check if the user is authenticated
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    // Fetch payments from Stripe
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100,
      expand: ['data.customer']
    });
    
    // Transform payment intents into donation objects
    const donations = paymentIntents.data
      .filter(pi => pi.status === 'succeeded' || pi.status === 'processing')
      .map(pi => ({
        id: pi.id,
        paymentIntentId: pi.id,
        donorName: pi.metadata.donorName || 'Anonymous',
        donorEmail: pi.metadata.donorEmail || 'unknown',
        amount: (pi.amount / 100).toFixed(2),
        memberCredited: pi.metadata.memberCredited || 'None',
        memberSlug: pi.metadata.memberSlug || '',
        status: pi.status === 'succeeded' ? 'completed' : 'processing',
        timestamp: new Date(pi.created * 1000).toISOString()
      }));
    
    return res.status(200).json({ donations });
  } catch (error) {
    console.error('Error fetching donations:', error);
    return res.status(500).json({ error: 'Failed to fetch donations' });
  }
}
