const express = require("express");
const app = express();
const path = require("path");

const PORT = process.env.PORT || 3000;

app.use(express.json());

// homepage
app.get("/", (req, res) => {
  res.send("🔥 VIVEK X MOD SERVER LIVE 🔥");
});

// test api
app.get("/status", (req, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
