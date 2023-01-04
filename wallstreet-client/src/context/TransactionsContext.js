import { createContext } from "preact";

import { useState } from "preact/hooks";

export const TransactionsContext = createContext();

export const TransactionsContextProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  return (
    <TransactionsContext.Provider
      value={[transactions, setTransactions]}>
      {children}
    </TransactionsContext.Provider>
  );
}
