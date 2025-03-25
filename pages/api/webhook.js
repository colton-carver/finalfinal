import Stripe from "stripe";
import { buffer } from "micro";
import clientPromise from "../../lib/mongodb";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      const buf = await buffer(req);
      event = stripe.webhooks.constructEvent(buf.toString(), sig, process.env.STRIPE_WEBHOOK_SECRET);
      console.log("Webhook verified, event type:", event.type);
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).json({ error: `Webhook Error: ${err.message}` });
    }

    // Handle the event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      console.log("Payment succeeded:", paymentIntent.id);

      try {
        const client = await clientPromise;
        const db = client.db("aliceingreekland");
        
        const result = await db.collection("donations").updateOne(
          { paymentIntentId: paymentIntent.id },
          { $set: { status: "completed" } }
        );

        if (result.matchedCount === 0) {
          // If no donation was found, create one from the payment intent metadata
          const { donorName, donorEmail, memberCredited, memberSlug } = paymentIntent.metadata;
          
          await db.collection("donations").insertOne({
            paymentIntentId: paymentIntent.id,
            donorName,
            donorEmail,
            amount: (paymentIntent.amount / 100).toFixed(2), // Convert cents to dollars
            memberCredited,
            memberSlug,
            status: "completed",
            timestamp: new Date().toISOString(),
          });
        }
      } catch (dbError) {
        console.error("Database error in webhook:", dbError);
      }
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

