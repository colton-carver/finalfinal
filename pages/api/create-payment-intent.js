import Stripe from "stripe";
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const { amount, donorName, donorEmail, memberCredited, memberSlug } = req.body;

      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          donorName,
          donorEmail,
          memberCredited,
          memberSlug,
        },
        receipt_email: donorEmail,
        description: `Donation to Alice in Greekland - Credited to ${memberCredited}`,
      });

      // Save donation to database
      try {
        console.log("Attempting to connect to MongoDB...");
        const client = await clientPromise;
        console.log("Connected to MongoDB client");
        
        const db = client.db("aliceingreekland");
        console.log("Accessed aliceingreekland database");
        
        const donation = {
          paymentIntentId: paymentIntent.id,
          donorName,
          donorEmail,
          amount,
          memberCredited,
          memberSlug,
          status: "pending",
          timestamp: new Date().toISOString(),
        };
        console.log("Prepared donation document:", donation);
        
        const result = await db.collection("donations").insertOne(donation);
        console.log("Donation saved to database:", result);
      } catch (dbError) {
        console.error("Database error details:", dbError);
        // Continue even if database save fails
        // This ensures the payment can still be processed
      }

      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ error: "Failed to process payment" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

