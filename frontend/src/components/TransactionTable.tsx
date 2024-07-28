import React, { useEffect, useMemo, useState } from 'react';
import { DetailsList, IColumn, DetailsListLayoutMode, SelectionMode, Icon } from '@fluentui/react';
import Pagination from './pagination';
import { Transaction, TransactionKey } from '../store/transactions';
import { IDetailsColumnProps } from '@fluentui/react/lib/DetailsList';

type TransactionTableProps = {
    transactions: Transaction[];
};

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
    const [currentPage, setCurrentPage] = useState(1);


    const [sortColumn, setSortColumn] = useState<TransactionKey | "">("");
    const [isSortDescending, setIsSortDescending] = useState<boolean>(false);
    const itemsPerPage = 10;
    const paginatedTransactions = useMemo(() => transactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [transactions,itemsPerPage,currentPage]);
    const [sortedPaginatedTransactions, setSortedPaginatedTransactions] = useState(paginatedTransactions);

    useEffect(
        () => {
            setSortedPaginatedTransactions(paginatedTransactions);
            console.log("aws paginatedTransactions", paginatedTransactions);
        },
        [paginatedTransactions],
    );
    console.log("inside TransactionTable, transactions", transactions);
    const renderHeader = (props?: IDetailsColumnProps): JSX.Element | null => {
        if (!props) return null;
        const { column } = props;
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span>{column.name}</span>
                {sortColumn === column.fieldName && (
                    <Icon
                        iconName={isSortDescending ? 'ChevronDown' : 'ChevronUp'}
                        styles={{ root: { marginLeft: 8 } }}
                    />
                )}
            </div>
        );
    };

    const onColumnClick = (_: unknown, column: IColumn): void => {
        const fieldName = column.fieldName as TransactionKey;
        const newIsSortDescending = sortColumn === fieldName ? !isSortDescending : false;
        setSortColumn(fieldName);
        setIsSortDescending(newIsSortDescending);

        const newSortedTransactions = [...sortedPaginatedTransactions].sort((a, b) => {
            if (a[fieldName] < b[fieldName]) {
                return newIsSortDescending ? 1 : -1;
            }
            if (a[fieldName] > b[fieldName]) {
                return newIsSortDescending ? -1 : 1;
            }
            return 0;
        });

        setSortedPaginatedTransactions(newSortedTransactions);
    };
    const columns: IColumn[] = [
        {
            key: 'transaction_id',
            name: 'Transaction ID',
            fieldName: 'transaction_id',
            minWidth: 50,
            maxWidth: 100,
            isResizable: true,
            onColumnClick: onColumnClick,
            isSorted: sortColumn === 'transaction_id',
            isSortedDescending: isSortDescending,
            onRenderHeader: renderHeader,

        },
        {
            key: 'accountId',
            name: 'Account ID',
            fieldName: 'account',
            minWidth: 50,
            maxWidth: 100,
            isResizable: true,
            onColumnClick: onColumnClick,
            isSorted: sortColumn === 'account',
            isSortedDescending: isSortDescending,
            onRenderHeader: renderHeader,

        },
        {
            key: 'date',
            name: 'Date',
            fieldName: 'date',
            minWidth: 100,
            maxWidth: 150,
            isResizable: true,
            onColumnClick: onColumnClick,
            isSorted: sortColumn === 'date',
            isSortedDescending: isSortDescending,
            onRenderHeader: renderHeader,

        },
        {
            key: 'amount',
            name: 'Amount',
            fieldName: 'amount',
            minWidth: 50,
            maxWidth: 100,
            isResizable: true,
            onColumnClick: onColumnClick,
            onRenderHeader: renderHeader,
            isSorted: sortColumn === 'amount',
            isSortedDescending: isSortDescending,
        },
        {
            key: 'transaction_type',
            name: 'Transaction Type',
            fieldName: 'transaction_type',
            minWidth: 100,
            maxWidth: 150,
            isResizable: true,
            onColumnClick: onColumnClick,
            onRenderHeader: renderHeader,
            isSorted: sortColumn === 'transaction_type',
            isSortedDescending: isSortDescending,
        },
    ];



    const onPageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber + 1);
    };

    console.log("inside TransactionTable, sortedPaginatedTransactions", sortedPaginatedTransactions);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <DetailsList
                items={sortedPaginatedTransactions}
                columns={columns}
                setKey="set"
                layoutMode={DetailsListLayoutMode.fixedColumns}
                selectionMode={SelectionMode.none}
            />
            <Pagination
                pageCount={Math.ceil(transactions.length / itemsPerPage)}
                selectedPageIndex={currentPage - 1}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default TransactionTable;
