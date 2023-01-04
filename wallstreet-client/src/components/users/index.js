import { TransactionsContext } from '../../context/TransactionsContext';

import { useState, useContext } from 'preact/hooks';

import calculateDebt from '../../utils/calculateDebt';

const Users = () => {
  const [users, setUsers] = useState([
		{ id: 1, name: "daan", transactions: [] },
		{ id: 2, name: "tim", transactions: [] },
	]);
	
  const {
		transactions,
		setTransactions,
		selectedTransactionIds,
		setSelectedTransactionIds,
  } = useContext(TransactionsContext);
  
	const handleUser = (id) => {
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
  
  return (
    <section>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li onClick={() => handleUser(user.id)}>
            <h4>{user.name}</h4>
            <p>Debt: {calculateDebt(user.transactions)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Users;
