// Vercel Serverless Function: POST /api/wishlist -> MongoDB Atlas
import { MongoClient } from "mongodb";

let client;
async function getClient() {
  if (!client) client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  return client;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const b = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const doc = {
      timestamp: new Date(b.timestamp || Date.now()),
      selectedGift: String(b.selectedGift || "").slice(0, 200),
      brandOrLink: String(b.brandOrLink || "").slice(0, 1000),
      note: String(b.note || "").slice(0, 2000),
      userBehavior: String(b.userBehavior || "").slice(0, 500),
    };
    const c = await getClient();
    await c.db("wishlist2010").collection("orders").insertOne(doc);
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "DB error" });
  }
}
