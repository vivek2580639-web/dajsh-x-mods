import express from "express";
import admin from "firebase-admin";

const app = express();
app.use(express.json());

// 🔐 Firebase Admin init (ENV se)
const serviceAccount = JSON.parse(
  process.env.FIREBASE_PRIVATE_KEY_JSON
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// 🔥 Home test
app.get("/", (req, res) => {
  res.send("🔥 VIVEK X MOD SERVER LIVE 🔥");
});

// 🔑 KEY VERIFY API
app.post("/verify-key", async (req, res) => {
  const { key } = req.body;

  if (!key) {
    return res.status(400).json({ error: "Key missing" });
  }

  try {
    const snap = await db
      .collection("keys")
      .where("key", "==", key)
      .limit(1)
      .get();

    if (snap.empty) {
      return res.status(403).json({ error: "Invalid key" });
    }

    const doc = snap.docs[0];

    if (doc.data().used === true) {
      return res.status(403).json({ error: "Key already used" });
    }

    await doc.ref.update({
      used: true,
      usedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true });

  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
