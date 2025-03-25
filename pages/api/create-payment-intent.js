import Stripe from "stripe"

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

      // Extract data from the request
      const { amount, donorName, donorEmail, memberCredited, memberSlug } = req.body

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
      })

      // Save donation to database (in a real implementation)
      // await saveDonationToDatabase({...});

      res.status(200).json({ clientSecret: paymentIntent.client_secret })
    } catch (error) {
      console.error("Error creating payment intent:", error)
      res.status(500).json({ error: "Failed to process payment" })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

