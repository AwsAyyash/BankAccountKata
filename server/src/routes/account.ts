import { AppDataSource } from "../data-source";
import { Account } from "../entity/Account";
import { createAccountSchema, updateAccountSchema } from "../schemaValidation/validateAccount";
import { validate } from "../schemaValidation/validate";
import { Router, Request, Response } from 'express';

const router = Router();

// Get all accounts
router.get("/", async (req: Request, res: Response) => {
    try {
        const accounts = await AppDataSource.getRepository(Account).find();
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching accounts", error });
    }
});

// Create a new account
router.post("/", validate(createAccountSchema), async (req: Request, res: Response) => {
    try {
        const account = AppDataSource.getRepository(Account).create(req.body);
        const result = await AppDataSource.getRepository(Account).save(account);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error creating account", error });
    }
});

// Get account by ID
router.get("/:id", async (req, res) => {
    try {
        const account = await AppDataSource.getRepository(Account).findOneBy({
            account_id: parseInt(req.params.id),
        });
        if (account) {
            res.json(account);
        } else {
            res.status(404).json({ message: "Account not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching account", error });
    }
});

// Update account by ID
router.put("/:id", validate(updateAccountSchema), async (req: Request, res: Response) => {
    try {
        const accountRepo = AppDataSource.getRepository(Account);
        const account = await accountRepo.findOneBy({
            account_id: parseInt(req.params.id),
        });
        const newBalance = req.body.balance;
        if (newBalance < 0) {
            res.status(401).json({ message: "Invalid new balance" });
        }

        if (account) {
            accountRepo.merge(account, req.body);
            const result = await accountRepo.save(account);
            res.json(result);
        } else {
            res.status(404).json({ message: "Account not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating account", error });
    }
});

// Delete account by ID
router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const result = await AppDataSource.getRepository(Account).delete(parseInt(req.params.id));
        if (result.affected) {
            res.status(204).end();
        } else {
            res.status(404).json({ message: "Account not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting account", error });
    }
});

export default router;
