import { createContext } from "preact";

import { useEffect, useState } from "preact/hooks";

export const TransactionsContext = createContext();

export const TransactionsContextProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransactionIds, setSelectedTransactionIds] = useState(new Set());
  const [transactionSplit, setTransactionSplit] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("users"));
    const savedTransactions = JSON.parse(localStorage.getItem("transactions"));
    if (savedTransactions) {
      setTransactions(savedTransactions);
    }

    if (savedUsers) {
      savedUsers.forEach(user => { user.selected = false });
      setUsers(savedUsers);
    }
  }, []);

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
