import { TransactionsContext } from '../../context/TransactionsContext';

import { useState, useContext, useEffect } from 'preact/hooks';

import calculateDebt from '../../utils/calculateDebt';

import style from './style.css';

const Users = () => {
	const [splitUsers, setSplitUsers] = useState([]);
	const [inspectUser, setInspectUser] = useState(null);

	const {
		users,
		setUsers,
		transactions,
		setTransactions,
		selectedTransactionIds,
		setSelectedTransactionIds,
		transactionSplit,
		setTransactionSplit,
	} = useContext(TransactionsContext);

	useEffect(() => {
		const savedUsers = JSON.parse(localStorage.getItem('users'));
		if (savedUsers) {
			setUsers(savedUsers);
		}
	}, []);

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

	function addUser(event) {
		event.preventDefault();

		if (event.target[0].value.trim() === '') return;
		const name = event.target[0].value;
		const id = users.length + 1;

		setUsers([...users, { id, name, transactions: [], selected: false }]);

		event.target.reset();
	}

	return (
		<section className={style.users}>
			<div>
				<div className={style.usersHeaderContainer}>
					<h1 className={style.usersHeader}>Users</h1>
					<form className={style.form} onSubmit={addUser}>
						<input type="text" placeholder="Add user" />
					</form>
				</div>
				<div>
					<ul className={style.usersList}>
						{users.map((user) => (
							<li className={style.userContainer} onClick={() => handleUser(user.id)}>
								<h2>{user.name} {user.selected ? '✅' : ''}</h2>
								<p className={style.userDebt}><b>Debt</b>: {calculateDebt(user.transactions)}</p>
								{
									inspectUser === user.id && (
										<div>
											{user.transactions.length === 0 && <p><i>No transactions yet</i></p>}
											<ul>
												{user.transactions.map((transaction) => (
													<li className={style.userTransaction}>
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
								className="button"
								disabled={splitUsers.length === 0}
								onClick={onClickSplit}>
								Confirm split
							</button>
						)
					}
				</div>
			</div>
		</section>
	);
}

export default Users;
