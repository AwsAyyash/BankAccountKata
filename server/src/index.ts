import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import accountRoutes from "./routes/account";
import transactionRoutes from "./routes/transaction";
import transferRoutes from "./routes/transfer";
import path from "path";

const app = express();
app.use(express.json());

AppDataSource.initialize()
    .then(() => {
        console.log("Connected to the database");

        app.use("/api/v1/accounts", accountRoutes);
        app.use("/api/v1/transactions", transactionRoutes);
        app.use("/api/v1/transfers", transferRoutes);

        console.log("__dirname", __dirname);
        // Serve static files from the frontend dist directory
        app.use(express.static(path.join(__dirname, '../../frontend/dist')));

        // Serve the React app
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'));
        });

        const port = process.env.PORT || 9000;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => console.log("Error connecting to the database", error));
