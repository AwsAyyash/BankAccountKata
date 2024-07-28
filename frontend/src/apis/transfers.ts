import { sendRequest } from '.';

const baseApisURL = "api/v1/transfers";

export const getTransfers = async () => sendRequest(`${baseApisURL}`, 'GET');

export const getTransfer = async (transferId: number) => sendRequest(`${baseApisURL}/${transferId}`, 'GET');

export const addTransfer = async (
    recipient_iban: string,
    transaction_id: string,
) => sendRequest(`${baseApisURL}`, 'POST', {
    recipient_iban,
    transaction_id,
});
