import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Transaction } from "../entity/Transaction";
import { Account } from "../entity/Account";
import { Transfer } from "../entity/Transfer";

const router = Router();

// Get all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await AppDataSource.getRepository(Transaction).find({ relations: ["account"] });
    console.log("transactionsaws", transactions);
    const transformedResponse = transactions.map(trans => ({ ...trans, account: trans.account.account_id }));
    res.json(transformedResponse);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
});

// Create a new transaction
router.post("/", async (req, res) => {
  try {
    const transactionRepo = AppDataSource.getRepository(Transaction);
    const accountRepo = AppDataSource.getRepository(Account);
    const { account: account_id, amount, transaction_type, recipient_iban, ...transactionData } = req.body;

    // Find the account associated with the transaction
    const account = await accountRepo.findOneBy({
      account_id,
    });

    if (!account) {
      return res.status(400).json({ message: "Account not found" });
    }
    if (transaction_type === 'Deposit') {
      const transaction = transactionRepo.create({ ...transactionData, amount, account, balance: account.balance, transaction_type });
      account.balance += amount;
      const result = await transactionRepo.save(transaction);
      await accountRepo.save(account);

      return res.status(201).json(result);
    } else if (transaction_type === 'Withdrawal') {
      if (account.balance < amount) {
        return res.status(400).json({ message: 'Insufficient funds' });
      }


      const transaction = transactionRepo.create({ ...transactionData, amount, account, balance: account.balance, transaction_type });
      account.balance -= amount;
      const result = await transactionRepo.save(transaction);
      await accountRepo.save(account);

      return res.status(201).json(result);
    } else if (transaction_type === 'Transfer') {
      if (account.balance < amount) {
        return res.status(400).json({ message: 'Insufficient funds' });
      }

      const transaction = transactionRepo.create({ ...transactionData, amount, account, balance: account.balance, transaction_type });
      const transactionResult = await transactionRepo.save(transaction);

      account.balance -= amount;

      const transfer = new Transfer();
      transfer.recipient_iban = recipient_iban;
      transfer.transaction = transaction[0];

      const transferRepository = AppDataSource.getRepository(Transfer);
      await transferRepository.save(transfer);

      await accountRepo.save(account);

      return res.status(201).json(transactionResult);
    }
    else {
      return res.status(400).json({ message: 'Invalid transaction type' });
    }

  } catch (error) {
    res.status(500).json({ message: "Error creating transaction", error });
  }
});

// Get transaction by ID
router.get("/:id", async (req, res) => {
  try {
    const transaction = await AppDataSource.getRepository(Transaction).findOneBy({
      transaction_id: parseInt(req.params.id),
    });
    if (transaction) {
      res.json(transaction);
    } else {
      res.status(404).json({ message: "Transaction not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching transaction", error });
  }
});

// Update transaction by ID
router.put("/:id", async (req, res) => {
  try {
    const transactionRepo = AppDataSource.getRepository(Transaction);
    const transaction = await transactionRepo.findOneBy({
      transaction_id: parseInt(req.params.id),
    });
    if (transaction) {
      transactionRepo.merge(transaction, req.body);
      const result = await transactionRepo.save(transaction);
      res.json(result);
    } else {
      res.status(404).json({ message: "Transaction not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating transaction", error });
  }
});

// Delete transaction by ID
router.delete("/:id", async (req, res) => {
  try {
    const result = await AppDataSource.getRepository(Transaction).delete(parseInt(req.params.id));
    if (result.affected) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: "Transaction not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting transaction", error });
  }
});

export default router;
