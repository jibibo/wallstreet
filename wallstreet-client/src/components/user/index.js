import { TransactionsContext } from '../../context/TransactionsContext';

import { Link } from "preact-router/match";

import { useState, useContext } from 'preact/hooks';

import calculateDebt from '../../utils/calculateDebt';

import style from './style.css';

const UserEntry = ({ user, splitUsers, setSplitUsers }) => {
  const {
    users,
    setUsers,
    transactions,
    setTransactions,
    selectedTransactionIds,
    setSelectedTransactionIds,
    transactionSplit,
  } = useContext(TransactionsContext);

  const handleUser = (id) => {
    if (transactionSplit) {
      const user = users.find((user) => user.id === id);
      user.selected = !user.selected;

      if (user.selected) {
        setSplitUsers([...splitUsers, user]);
      } else {
        setSplitUsers(splitUsers.filter((user) => user.id !== id));
      }

      setUsers([...users]);
      return;
    }

    const user = users.find((user) => user.id === id);

    if (selectedTransactionIds.size === 0) return;

    selectedTransactionIds.forEach((id) => {
      const transaction = transactions.find((transaction) => transaction.id === id);
      user.transactions.push(transaction);
    });

    setUsers([...users]);
    setTransactions(
      transactions.filter((transaction) => !selectedTransactionIds.has(transaction.id))
    );
    setSelectedTransactionIds(new Set());
  }

  const handleDragOver = (event) => {
    event.preventDefault();
  }

  const handleOnDrop = (event, userId) => {
    const user = users.find((user) => user.id === userId);
    const transactionId = event.dataTransfer.getData("text/plain");

    const transaction = transactions.find((transaction) => transaction.id === transactionId);

    user.transactions.push(transaction);

    setUsers([...users]);
    setTransactions(
      transactions.filter((transaction) => transaction.id !== transactionId)
    );

    // Clear the selected transaction if it was in selectedTransactionIds
    if (selectedTransactionIds.has(transactionId)) {
      selectedTransactionIds.delete(transactionId);
      setSelectedTransactionIds(new Set(selectedTransactionIds));
    }
  }

  const handleUserSplit = (userId) => {
    const user = users.find((user) => user.id === userId);
    user.splitCount += 1;

    setUsers([...users]);
  }

  return (
    <li
      className={style.userContainer}
      style={{
        border: user.selected ? '2px solid white' : 'none',
      }}
      onDragOver={handleDragOver}
      onDrop={(event) => handleOnDrop(event, user.id)}>
      <button onClick={() => handleUserSplit(user.id)}>{user.splitCount}x</button>
      <h2 onClick={() => handleUser(user.id)}>{user.name}</h2>
      <p className={style.userDebt}>{calculateDebt(user.transactions)}</p>
      <Link href={`/user/${user.id}`}>
        <button style={{ marginTop: "10px" }} className="button">
          View all {user.transactions.length} transactions
        </button>
      </Link>
    </li>
  );
}

export default UserEntry;