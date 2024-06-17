const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

const receipts = [];

// Helper function to calculate points based on the receipt data
function calculatePoints(receipt) {
  let points = 0;

  // One point for every alphanumeric character in the retailer name
  points += (receipt.retailer.match(/[a-zA-Z0-9]/g) || []).length;

  // 50 points if the total is a round dollar amount with no cents
  if (Number(receipt.total) % 1 === 0) {
    points += 50;
  }
  // 25 points if the total is a multiple of 0.25
  if (Number(receipt.total) % 0.25 === 0) {
    points += 25;
  }

  // 5 points for every two items on the receipt
  points += Math.floor(receipt.items.length / 2) * 5;

  // Calculate points for each item
  receipt.items.forEach((item) => {
    const trimmedDescription = item.shortDescription.trim();
    if (trimmedDescription.length % 3 === 0) {
      const itemPoints = Math.ceil(Number(item.price) * 0.2);
      if (itemPoints > 0) {
        points += itemPoints;
      }
    }
  });

  // 6 points if the day in the purchase date is odd
  if (new Date(receipt.purchaseDate).getUTCDate() % 2 !== 0) {
    points += 6;
  }

  // 10 points if the time of purchase is after 2:00pm and before 4:00pm
  const purchaseTime = new Date(`1970-01-01T${receipt.purchaseTime}`);
  const startTime = new Date("1970-01-01T14:00");
  const endTime = new Date("1970-01-01T16:00");
  if (purchaseTime >= startTime && purchaseTime <= endTime) {
    points += 10;
  }
  return points;
}

// POST /receipts/process
app.post("/receipts/process", (req, res) => {
  const receipt = req.body;

  // Validate receipt data
  if (
    !receipt.retailer ||
    !receipt.purchaseDate ||
    !receipt.purchaseTime ||
    !receipt.items ||
    !receipt.total
  ) {
    return res
      .status(400)
      .json({ error: "Invalid receipt data. Missing required fields." });
  }

  // Validate retailer name format
  if (!/^[\w\s\-&]+$/.test(receipt.retailer)) {
    return res.status(400).json({ error: "Invalid retailer name format." });
  }

  // Validate purchase date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(receipt.purchaseDate)) {
    return res.status(400).json({
      error: "Invalid purchase date format. Expected format: YYYY-MM-DD.",
    });
  }

  // Validate purchase time format
  if (!/^\d{2}:\d{2}$/.test(receipt.purchaseTime)) {
    return res
      .status(400)
      .json({ error: "Invalid purchase time format. Expected format: HH:mm." });
  }

  // Validate items array
  if (!Array.isArray(receipt.items) || receipt.items.length === 0) {
    return res
      .status(400)
      .json({ error: "Invalid items array. Expected a non-empty array." });
  }

  // Validate each item
  for (const item of receipt.items) {
    if (!item.shortDescription || !item.price) {
      return res
        .status(400)
        .json({ error: "Invalid item data. Missing required fields." });
    }
    if (!/^[\w\s\-]+$/.test(item.shortDescription)) {
      return res
        .status(400)
        .json({ error: "Invalid item description format." });
    }
    if (!/^\d+\.\d{2}$/.test(item.price)) {
      return res
        .status(400)
        .json({ error: "Invalid item price format. Expected format: X.XX." });
    }
  }

  // Validate total amount format
  if (!/^\d+\.\d{2}$/.test(receipt.total)) {
    return res
      .status(400)
      .json({ error: "Invalid total amount format. Expected format: X.XX." });
  }

  // Generate unique ID
  const id = uuidv4();

  // Calculate points
  const points = calculatePoints(receipt);

  // Store receipt data and points
  receipts.push({ id, ...receipt, points });

  res.json({ id });
});

// GET /receipts/{id}/points
app.get("/receipts/:id/points", (req, res) => {
  const { id } = req.params;

  // Find receipt by ID
  const receipt = receipts.find((r) => r.id === id);

  if (!receipt) {
    res.status(404).json({ error: "Receipt not found" });
  } else {
    res.json({ points: receipt.points });
  }
});

// Error handling middleware
app.use((err, res) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}/`);
});
