import { createContext } from "preact";

import { useState } from "preact/hooks";

export const TransactionsContext = createContext();

export const TransactionsContextProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransactionIds, setSelectedTransactionIds] = useState(new Set());
  const [transactionSplit, setTransactionSplit] = useState(false);
  const [users, setUsers] = useState([]);

  return (
    <TransactionsContext.Provider
      value={{
        users,
        setUsers,
        transactions,
        setTransactions,
        selectedTransactionIds,
        setSelectedTransactionIds,
        transactionSplit,
        setTransactionSplit,
      }}>
      {children}
    </TransactionsContext.Provider>
  );
}
