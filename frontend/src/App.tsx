import { useEffect, useState } from 'react';
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css';
import { DefaultButton, Dropdown, IDropdownOption, PrimaryButton, Spinner, TextField } from '@fluentui/react';
import { TransactionOperations } from './apis/transactions';
import { conditinoalyRender } from './utils/reactUtils/reactUtils';
import IBAN from 'iban'; // Import the IBAN library
import { Transaction, useTransactionsStore } from './store/transactions';
import TransactionTable from './components/TransactionTable';

type RoutingPage = "Transactions" | "Statements";

const operationOptions: IDropdownOption[] = [
  { key: 'Deposit', text: 'Deposit', title: 'Deposit money to your account.' },
  { key: 'Withdrawal', text: 'Withdrawal', title: 'Withdraw money from your account.' },
  { key: 'Transfer', text: 'Transfer', title: 'Transfer money to another account.' },
];

const routingPageOptions: IDropdownOption[] = [
  { key: 'Transactions', text: 'Make new transactions', title: 'Transactions page.' },
  { key: 'Statements', text: 'See old statements', title: 'Statements page.' },
];

function App() {
  const [routingPage, setRoutingPage] = useState<RoutingPage>("Statements");

  const [operation, setOperation] = useState<TransactionOperations>("Deposit");
  const [operationAmount, setOperationAmount] = useState<number>(0);
  const [transferRecipientIban, setTransferRecipientIban] = useState<string>("");

  const { addTransaction, transaction, addTransactionErr, addTransactionInProgress, resetAddTransaction, transactions, loadTransactions, loadTransactionsErr, loadTransactionsInProgress } = useTransactionsStore();
  const [filterType, setFilterType] = useState<TransactionOperations | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[] | null>(transactions);

  useEffect(
    () => {
      loadTransactions();
      console.log("load");
    },
    [loadTransactions],
  );

  useEffect(
    () => {
      if (transactions && !filteredTransactions) {
        setFilteredTransactions(transactions);
      }
    },
    [transactions, filteredTransactions],
  );

  const applyFilters = () => {
    let filteredData = transactions!;

    if (filterType) {
      filteredData = filteredData.filter(transaction => transaction.transaction_type === filterType);
    }

    if (startDate) {
      filteredData = filteredData.filter(transaction => new Date(transaction.date) >= new Date(startDate));
    }

    if (endDate) {
      filteredData = filteredData.filter(transaction => new Date(transaction.date) <= new Date(endDate));
    }

    filteredData = filteredData.sort((a, b) => {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      return bDate.getTime() - aDate.getTime();
    });
    console.log("filteredData", filteredData);
    setFilteredTransactions(filteredData);

  };

  const getOperationContainer = (operation: TransactionOperations, onClick: () => void) => {

    return <div className='operation-continer'>
      <input type='number' min={0} placeholder={`Enter ${operation} amount`} className='operation-input' onChange={e => setOperationAmount(parseInt(e.target.value))} />
      {conditinoalyRender(
        operation === "Transfer",
        <input
          type='text'
          placeholder={`Enter Recipient Iban`}
          className='operation-input'
          onChange={e => {
            setTransferRecipientIban(e.target.value);
          }} />

      )}
      <PrimaryButton
        text={operation}
        onClick={() => {
          if (operation === "Transfer" && !IBAN.isValid(transferRecipientIban)) {
            alert("Invalid IBAN");
            return;
          }
          onClick();
        }} />
    </div>;
  };
  const getOperationContent = () => {
    switch (operation) {
      case "Deposit":
        return getOperationContainer(operation, () => addTransaction(1, operation, operationAmount));
      case "Withdrawal":
        return getOperationContainer(operation, () => addTransaction(1, operation, operationAmount));
      case "Transfer":
        return getOperationContainer(operation, () => addTransaction(1, operation, operationAmount, transferRecipientIban));
    }
  };

  const transactionsPage = <>
    <Dropdown
      placeholder="Choose operation type"
      label="Choose operation type"
      options={operationOptions}
      defaultSelectedKey={operation}
      onChange={(_, option) => {
        resetAddTransaction();
        setOperation(option?.key as TransactionOperations);
      }}
      className='drop-down-container'
    />
    {getOperationContent()}
    {conditinoalyRender(
      !!addTransactionErr,
      <div style={{ color: "red", marginTop: "16px", fontWeight: 500 }}>
        {`Error happened while making your transaction: ${addTransactionErr}`}
      </div>
    )}
    {conditinoalyRender(
      !!addTransactionInProgress,
      <Spinner />
    )}
    {conditinoalyRender(
      !!transaction,
      <div style={{ color: "red", marginTop: "16px", fontWeight: 500 }}>
        {`Your transaction is done: ${transaction?.transaction_type} ${transaction?.amount}$ on ${transaction?.date}`}
      </div>
    )}
  </>;



  const getEffectivePageContent = () => {
    switch (routingPage) {
      case "Transactions":
        return transactionsPage;
      case "Statements": {
        if (loadTransactionsInProgress) {
          return <Spinner />;
        }
        if (loadTransactionsErr) {
          return <div style={{ color: "red", marginTop: "16px", fontWeight: 500 }}>
            {`Error happened while loading your transaction: ${loadTransactionsErr}`}
          </div>;
        }
        if (!transactions || !filteredTransactions) {
          return null;
        }
        const statementsPage = <>
          <h1>Transaction Table</h1>
          <div style={{ margin: '16px', display: "flex", flexDirection: "column", gap: "8px" }}>
            <label>Filters by:</label>
            <Dropdown
              placeholder="Select transaction type"
              options={operationOptions}
              onChange={(_, option) => setFilterType(option?.key as TransactionOperations)}
              selectedKey={filterType}
            />
            <TextField
              label="Start Date"
              type="date"

              onChange={(_, newValue) => setStartDate(newValue as unknown as Date || undefined)}
            />
            <TextField
              label="End Date"
              type="date"
              onChange={(_, newValue) => setEndDate(newValue as unknown as Date || undefined)}
            />
            <DefaultButton text="Filter" onClick={applyFilters} />
          </div>
          <TransactionTable transactions={filteredTransactions as Transaction[]} />
        </>;
        return statementsPage;
      }
    }
  };

  return <>
    <Dropdown
      placeholder="Choose Page type"
      label="Choose Page type"
      options={routingPageOptions}
      defaultSelectedKey={routingPage}
      onChange={(_, option) => {
        setRoutingPage(option?.key as RoutingPage);
      }}
      className='drop-down-container'
    />
    {getEffectivePageContent()}
  </>;
}

export default App;
