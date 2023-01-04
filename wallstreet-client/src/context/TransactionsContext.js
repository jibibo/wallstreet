import { createContext } from "preact";

import { useState } from "preact/hooks";

export const TransactionsContext = createContext();

export const TransactionsContextProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransactionIds, setSelectedTransactionIds] = useState(new Set());
  const [transactionSplit, setTransactionSplit] = useState(false);

  return (
    <TransactionsContext.Provider
      value={{
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
