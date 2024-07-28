import { create } from 'zustand';
import { addTransaction, getTransactions, TransactionOperations } from '../apis/transactions';

export type ApiError = {
    message: string;
};

export type Transaction = {
    transaction_id: number;
    account: number;
    date: Date;
    amount: number;
    balance: number;
    transaction_type: string; // enum: deposit, withdraw, transfer
};

export type TransactionKey = keyof Transaction;

type TransactionState = {


    loadTransactions: () => Promise<void>;

    transaction: Transaction | null,
    transactions: Transaction[] | null;
    loadTransactionsInProgress: boolean;
    loadTransactionsErr: string | null;


    addTransaction: (account: number, transaction_type: TransactionOperations, amount: number, recipient_iban?: string) => Promise<void>,
    addTransactionInProgress: boolean;
    addTransactionErr: string | null,
    resetAddTransaction: () => void,

    // deleteTown: (townId: number) => Promise<void>,
    // deleteTownInProgress: boolean,
    // deleteTownErr: string | null,
    // resetDeleteTown: () => void,

    // updateTown: (townId: number, name?: string, lat?: number, lng?: number) => Promise<void>,
    // updateTownInProgress: boolean,
    // updateTownErr: string | null,
    // resetUpdateTown: () => void,

    // state: State | null;
    // loadStateInProgress: boolean;
    // loadStateErr: string | null;

    // loadStates: (countryId: number) => Promise<void>;
    // loadTowns: (stateId: number) => Promise<void>;
    // loadCountry: (countryId: number) => Promise<void>;
    // loadState: (stateId: number) => Promise<void>;
    // loadTown: (townId: number) => Promise<void>;

};

export const useTransactionsStore = create<TransactionState>((set, get) => ({
    transactions: null,
    loadTransactionsInProgress: false,
    loadTransactionsErr: null,

    loadTransactions: async () => {
        try {
            set({
                loadTransactionsInProgress: true,
                loadTransactionsErr: null,
            });
            const resp = await getTransactions();
            console.log("resp===", resp);
            set({
                transactions: resp as Transaction[],
            });
        } catch (_err) {
            const err = _err as ApiError;
            set({
                loadTransactionsErr: err.message
            });
        } finally {
            set({
                loadTransactionsInProgress: false,
            });
        }
    },

    // country: null,
    // loadCountryInProgress: false,
    // loadCountryErr: null,

    // states: [],
    // loadStatesInProgress: false,
    // loadStatesErr: null,

    // state: null,
    // loadStateInProgress: false,
    // loadStateErr: null,

    // towns: [],
    // loadTownsInProgress: false,
    // loadTownsErr: null,

    // town: null,
    // loadTownInProgress: false,
    // loadTownErr: null,
    transaction: null,
    addTransaction: async (account, transaction_type, amount, recipient_iban) => {
        try {
            set({
                transaction: null,
                addTransactionInProgress: true,
                addTransactionErr: null,
            });
            const newTransaction = await addTransaction(transaction_type, amount, account, recipient_iban);
            console.log(newTransaction);
            set({
                transaction: newTransaction.transaction ?? newTransaction,
            });
            get().loadTransactions();
        } catch (_err) {
            const err = _err as ApiError;
            set({
                addTransactionErr: err.message
            });
        } finally {
            set({
                addTransactionInProgress: false,
            });
        }
    },
    addTransactionErr: null,
    addTransactionInProgress: false,
    resetAddTransaction: () => {
        set({
            addTransactionErr: null,
            addTransactionInProgress: false,
            transaction: null,
        });
    }
    // resetAddTown: () => {
    //     set({
    //         addTownErr: null,
    //         addTownInProgress: false,
    //     });
    // },

    // deleteTown: async (townId) => {
    //     try {
    //         set({
    //             deleteTownInProgress: true,
    //             deleteTownErr: null,
    //         });
    //         await deleteTown(townId);

    //         set({
    //             towns: get().towns.filter(town => town.id !== townId),
    //         });
    //     } catch (_err) {
    //         const err = _err as ApiError;
    //         set({
    //             deleteTownErr: err.message
    //         });
    //     } finally {
    //         set({
    //             deleteTownInProgress: false,
    //         });
    //     }
    // },
    // deleteTownErr: null,
    // deleteTownInProgress: false,
    // resetDeleteTown: () => {
    //     set({
    //         deleteTownErr: null,
    //         deleteTownInProgress: false,
    //     });
    // },

    // updateTown: async (townId, name, lat, lng) => {
    //     try {
    //         set({
    //             updateTownErr: null,
    //             updateTownInProgress: false,
    //         });
    //         await updateTown(townId, name, lat, lng);

    //         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    //         const oldTown = get().towns.find(town => town.id === townId)!;
    //         const newTown: Town = {
    //             ...oldTown,
    //             id: townId,
    //             name: name ?? oldTown.name,
    //             lat: lat ?? oldTown.lat,
    //             lng: lng ?? oldTown.lng,
    //         };
    //         set({
    //             town: newTown,
    //             towns: [...get().towns.filter(town => town.id !== townId), newTown]
    //         });
    //     } catch (_err) {
    //         const err = _err as ApiError;
    //         set({
    //             updateTownErr: err.message
    //         });
    //     } finally {
    //         set({
    //             updateTownInProgress: false,
    //         });
    //     }
    // },
    // updateTownInProgress: false,
    // updateTownErr: null,
    // resetUpdateTown: () => {
    //     set({
    //         updateTownErr: null,
    //         updateTownInProgress: false,
    //     });
    // },



    // loadStates: async (countryId: number) => {
    //     try {
    //         set({
    //             loadStatesInProgress: true,
    //             loadStatesErr: null,
    //         });
    //         const resp = await getStates(countryId);
    //         set({
    //             states: resp.states
    //         });
    //     } catch (_err) {
    //         const err = _err as ApiError;
    //         set({
    //             loadStatesErr: err.message
    //         });
    //     } finally {
    //         set({
    //             loadStatesInProgress: false,
    //         });
    //     }
    // },

    // loadTowns: async (stateId: number) => {
    //     try {
    //         set({
    //             loadTownsInProgress: true,
    //             loadTownsErr: null,
    //         });
    //         const resp = await getTowns(stateId);
    //         set({
    //             towns: resp.towns
    //         });
    //     } catch (_err) {
    //         const err = _err as ApiError;
    //         set({
    //             loadTownsErr: err.message
    //         });
    //     } finally {
    //         set({
    //             loadTownsInProgress: false,
    //         });
    //     }
    // },

    // loadCountry: async (countryId: number) => {
    //     try {
    //         set({
    //             loadCountryInProgress: true,
    //             loadCountryErr: null,
    //         });
    //         const resp = await getCountry(countryId);
    //         set({
    //             country: resp
    //         });
    //     } catch (_err) {
    //         const err = _err as ApiError;
    //         set({
    //             loadCountryErr: err.message
    //         });
    //     } finally {
    //         set({
    //             loadCountryInProgress: false,
    //         });
    //     }
    // },

    // loadTown: async (townId: number) => {
    //     try {
    //         set({
    //             loadTownInProgress: true,
    //             loadTownErr: null,
    //         });
    //         const resp = await getTown(townId);
    //         set({
    //             town: resp
    //         });
    //     } catch (_err) {
    //         const err = _err as ApiError;
    //         set({
    //             loadTownErr: err.message
    //         });
    //     } finally {
    //         set({
    //             loadTownInProgress: false,
    //         });
    //     }
    // },

    // loadState: async (stateId: number) => {
    //     try {
    //         set({
    //             loadStateInProgress: true,
    //             loadStateErr: null,
    //         });
    //         const resp = await getState(stateId);
    //         set({
    //             state: resp
    //         });
    //     } catch (_err) {
    //         const err = _err as ApiError;
    //         set({
    //             loadStateErr: err.message
    //         });
    //     } finally {
    //         set({
    //             loadStateInProgress: false,
    //         });
    //     }
    // },
}));

//export default useTransactionsStore;