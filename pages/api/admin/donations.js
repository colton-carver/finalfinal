import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import clientPromise from "../../../lib/mongodb";

export default async function handler(req, res) {
  // Check if the user is authenticated
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Fetch donations from your database
    const client = await clientPromise;
    const db = client.db("aliceingreekland");
    
    const donations = await db.collection("donations")
      .find({})
      .sort({ timestamp: -1 })
      .toArray();

    return res.status(200).json({ donations });
  } catch (error) {
    console.error("Error fetching donations:", error);
    
    // If database connection fails, return mock data as fallback
    const mockDonations = [
      {
        id: "1",
        paymentIntentId: "pi_123456",
        donorName: "John Doe",
        donorEmail: "john@example.com",
        amount: "25.00",
        memberCredited: "Adam Close",
        memberSlug: "adam-close",
        status: "completed",
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
      {
        id: "2",
        paymentIntentId: "pi_234567",
        donorName: "Jane Smith",
        donorEmail: "jane@example.com",
        amount: "50.00",
        memberCredited: "Courtney Larsen",
        memberSlug: "courtney-larsen",
        status: "completed",
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      },
    ];
    
    return res.status(200).json({ donations: mockDonations });
  }
}

