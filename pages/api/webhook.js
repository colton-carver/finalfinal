import Stripe from "stripe"
import { buffer } from "micro"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const sig = req.headers["stripe-signature"]
    let event

    try {
      const buf = await buffer(req)
      event = stripe.webhooks.constructEvent(buf.toString(), sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`)
      return res.status(400).json({ error: `Webhook Error: ${err.message}` })
    }

    // Handle the event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object

      // Update the donation status in the database (in a real implementation)
      // await updateDonationStatus(paymentIntent.id, 'completed');

      console.log(`Payment succeeded: ${paymentIntent.id}`)
    }

    res.status(200).json({ received: true })
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

