import { TransactionsContext } from '../../context/TransactionsContext';

import { useState, useContext } from 'preact/hooks';

import calculateDebt from '../../utils/calculateDebt';

const Users = () => {
	const [splitUsers, setSplitUsers] = useState([]);
	const [inspectUser, setInspectUser] = useState(null);
  const [users, setUsers] = useState([
		{ id: 1, name: "daan", transactions: [], selected: false },
		{ id: 2, name: "tim", transactions: [], selected: false },
	]);
	
  const {
		transactions,
		setTransactions,
		selectedTransactionIds,
		setSelectedTransactionIds,
		transactionSplit,
		setTransactionSplit,
  } = useContext(TransactionsContext);
  
	const handleUser = (id) => {
		if (selectedTransactionIds.size === 0) {
			if (inspectUser === id) {
				setInspectUser(null);
			} else {
				setInspectUser(id);
			}
		}
		
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
	
	const onClickSplit = () => {
		// Split the transactions based on the selected users
		const splitTransactions = transactions.filter((transaction) => selectedTransactionIds.has(transaction.id));
		
		const totalAmount = splitTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);
		const amountPerUser = totalAmount / splitUsers.length;
		
		splitTransactions.forEach((transaction) => {
			transaction.amount = amountPerUser;
		});
		
		users.forEach((user) => {
			if (user.selected) {
				user.transactions.push(...splitTransactions);
			}
			
			user.selected = !user.selected;
		});
		
		setUsers([...users]);
		
		setSelectedTransactionIds(new Set());
		setTransactions(
			transactions.filter((transaction) => !selectedTransactionIds.has(transaction.id))
		);
		setTransactionSplit(false);
		setSplitUsers([]);
	}		
  
  return (
    <section>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li onClick={() => handleUser(user.id)}>
            <h4>{user.name}</h4>
						<p>Debt: {calculateDebt(user.transactions)}</p>
						{user.selected ? '✅' : ''}
						{
							inspectUser === user.id && (
								<div>
									Transaction History
									<ul>
										{user.transactions.map((transaction) => (
											<li>
												{transaction.description}: {transaction.amount}
											</li>
										))}
									</ul>
								</div>
							)
						}
						
          </li>
        ))}
			</ul>
			{
				transactionSplit && (
					<button
						disabled={splitUsers.length === 0}
						onClick={onClickSplit}>
						Confirm split
					</button>
				)
			}
    </section>
  );
}

export default Users;
