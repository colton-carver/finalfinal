// pages/api/get-total-raised.js
import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      
      // Get all successful payments
      const paymentIntents = await stripe.paymentIntents.list({
        limit: 100, // Adjust as needed
      });
      
      // Calculate total from successful payments
      const totalRaised = paymentIntents.data
        .filter(pi => pi.status === 'succeeded')
        .reduce((sum, pi) => sum + pi.amount, 0) / 100; // Convert from cents
      
      res.status(200).json({ totalRaised });
    } catch (error) {
      console.error('Error fetching total raised:', error);
      res.status(500).json({ error: 'Failed to fetch total' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
