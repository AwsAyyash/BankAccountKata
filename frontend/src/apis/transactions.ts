import { sendRequest } from '.';

const baseApisURL = "api/v1/transactions";
export type TransactionOperations = "Deposit" | "Withdrawal" | "Transfer";

export const getTransactions = async () => sendRequest(`${baseApisURL}`, 'GET');

export const getTransaction = async (transactionId: number) => sendRequest(`${baseApisURL}/${transactionId}`, 'GET');

export const addTransaction = async (
    transaction_type: TransactionOperations,
    amount: number,
    account: number,
    recipient_iban?: string
) => sendRequest(`${baseApisURL}`, 'POST', {
    transaction_type,
    amount,
    account,
    recipient_iban,
});
