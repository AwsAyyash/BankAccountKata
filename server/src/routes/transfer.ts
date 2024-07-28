import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Transfer } from "../entity/Transfer";
import { Transaction } from "../entity/Transaction";

const router = Router();

// Get all transfers
router.get("/", async (req, res) => {
  try {
    const transfers = await AppDataSource.getRepository(Transfer).find({ relations: ["transaction"] });
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transfers", error });
  }
});

// Create a new transfer
router.post("/", async (req, res) => {
  try {
    const transferRepo = AppDataSource.getRepository(Transfer);
    const { transaction_id, ...transferData } = req.body;

    // Find the transaction associated with the transfer
    const transaction = await AppDataSource.getRepository(Transaction).findOneBy({
      transaction_id: transaction_id,
    });

    if (!transaction) {
      return res.status(400).json({ message: "Transaction not found" });
    }

    const transfer = transferRepo.create({ ...transferData, transaction });
    const result = await transferRepo.save(transfer);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error creating transfer", error });
  }
});

// Get transfer by ID
router.get("/:id", async (req, res) => {
  try {
    const transfer = await AppDataSource.getRepository(Transfer).findOneBy({
      transfer_id: parseInt(req.params.id),
    });
    if (transfer) {
      res.json(transfer);
    } else {
      res.status(404).json({ message: "Transfer not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching transfer", error });
  }
});

// Update transfer by ID
router.put("/:id", async (req, res) => {
  try {
    const transferRepo = AppDataSource.getRepository(Transfer);
    const transfer = await transferRepo.findOneBy({
      transfer_id: parseInt(req.params.id),
    });
    if (transfer) {
      transferRepo.merge(transfer, req.body);
      const result = await transferRepo.save(transfer);
      res.json(result);
    } else {
      res.status(404).json({ message: "Transfer not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating transfer", error });
  }
});

// Delete transfer by ID
router.delete("/:id", async (req, res) => {
  try {
    const result = await AppDataSource.getRepository(Transfer).delete(parseInt(req.params.id));
    if (result.affected) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Transfer not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting transfer", error });
  }
});

export default router;
