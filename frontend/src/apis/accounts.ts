import { sendRequest } from '.';

const baseApisURL = "api/v1/accounts";

export const getAccounts = async () => sendRequest(`${baseApisURL}`, 'GET');

export const getAccount = async (accountId: number) => sendRequest(`${baseApisURL}/${accountId}`, 'GET');

export const addAccount = async (
    account_number: string,
    account_type: string,
    balance: number,
) => sendRequest(`${baseApisURL}`, 'POST', {
    account_number,
    account_type,
    balance,
});
