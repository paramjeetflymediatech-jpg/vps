import express from "express";
const router = express.Router();

router.post("/upi/initiate", async (req, res) => {
  res.json({ ok: true });
});

export default router;
