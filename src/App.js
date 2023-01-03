import { useState } from "react";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState([
    {
      type: "withdrawal",
      amount: 20,
      description: "hello i need money kind regards julian",
      id: 1,
    },
    {
      type: "deposit",
      amount: 10,
      description: "tim",
      id: 2,
    },
    {
      type: "withdrawal",
      amount: 30,
      description: "beer",
      id: 3,
    },
    {
      type: "deposit",
      amount: 10,
      description: "daans",
      id: 4,
    },
    {
      type: "deposit",
      amount: 5,
      description: "jul",
      id: 5,
    },
  ]);
  const [users, setUsers] = useState([
    {
      name: "Daan",
      transactions: [],
      id: 1,
    },
    {
      name: "Tim",
      transactions: [],
      id: 2,
    },
    {
      name: "jul",
      transactions: [],
      id: 3,
    },
  ]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [inspectUser, setInspectUser] = useState(null);

  function calculateExpenseSum() {
    let total = 0;

    selectedTransactions.forEach((selected) => {
      const selectedAmount = transactions.find(
        (item) => item.id === selected.id
      );

      if (selected.type === "withdrawal") {
        total += selectedAmount;
      } else {
        total -= selectedAmount;
      }
    });

    return total;
  }

  function onClickTransaction(id) {
    // toggle transaction selected yes/no
    setSelectedTransactions((old) => {
      const wasSelected = old.includes(id);

      if (wasSelected) {
        return old.filter((oldId) => oldId !== id);
      }

      return [...old, id];
    });
  }

  function onClickUser(userId) {
    console.log("click user");
    if (selectedTransactions.length === 0) {
      // inspect user's transactions
      setInspectUser(userId);
    }

    const user = users.find((item) => item.id === userId);

    // Find transactions and add transactions to user transactions list
    selectedTransactions.forEach((selectedId) => {
      const selectedTransaction = transactions.find(
        (transaction) => transaction.id === selectedId
      );
      user.transactions.push(selectedTransaction);
    });

    // Remove selected transactions from the list of transactions
    setTransactions((old) =>
      old.filter(
        (oldTransaction) => !selectedTransactions.includes(oldTransaction.id)
      )
    );

    setSelectedTransactions([]);
  }

  function onClickSplitExpense() {}

  function calculateDebt(userId) {
    const user = users.find((user) => user.id === userId);

    let totalDebt = 0;

    // sum over transactions
    user.transactions.forEach((transaction) => {
      if (transaction.type === "deposit") {
        totalDebt -= transaction.amount;
      } else {
        totalDebt += transaction.amount;
      }
    });

    return totalDebt;
  }

  function onAddUser(event) {}

  return (
    <>
      <div className="transactions-wrapper">
        <h1>Transactions</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Amount</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(({ type, amount, description, id }) => (
              // sort by date (old to new)
              <tr
                key={id}
                className={
                  type + (selectedTransactions.includes(id) ? " selected" : "")
                }
                onClick={() => onClickTransaction(id)}
              >
                <td style={{ textAlign: "center" }}>#{id}</td>
                <td style={{ textAlign: "center" }}>
                  {(type === "deposit" ? "+" : "-") + `${amount}`}
                </td>
                <td>{description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={onClickSplitExpense}>
        TODO Split expense across users
      </button>
      <div className="users-wrapper">
        <h1>Users</h1>
        <form onSubmit={onAddUser}>
          <input type="text" placeholder="Add user..." name="name"></input>
        </form>
        <ul>
          {users.map((user) => {
            return (
              <div key={user.id}>
                <li onClick={() => onClickUser(user.id)}>
                  {user.name} (€ {calculateDebt(user.id)}) ( click to inspect{" "}
                  {user.transactions.length} items)
                </li>
                {inspectUser === user.id && user.transactions && (
                  <ul>
                    {user.transactions.map((transaction) => (
                      <li key={transaction.id}>
                        {transaction.type} {transaction.amount}{" "}
                        {transaction.description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default App;
