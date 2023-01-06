import { TransactionsContext } from '../../context/TransactionsContext';

import { useState, useContext, useEffect } from 'preact/hooks';
import { Link } from "preact-router/match";

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

		splitTransactions.forEach(transaction => {
			const amountPerUser = transaction.amount / splitUsers.length;
			transaction.amount = Math.round((amountPerUser + Number.EPSILON) * 100) / 100;
			users.forEach((user) => {
				if (user.selected) {
					user.transactions.push(transaction);
				}
			});
		})

		users.forEach((user) => {
			user.selected = false;
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


	return (
		<section className={style.users}>
			<div>
				<div className={style.usersHeaderContainer}>
					<h2 className={style.usersHeader}>Users</h2>
					<form className={style.form} onSubmit={addUser}>
						<input type="text" placeholder="+ &nbsp; Add user" />
					</form>
				</div>
				<div>
					<ul className={style.usersList}>
						{users.map((user) => (
							<li
								className={style.userContainer}
								style={{
									border: user.selected ? '2px solid white' : 'none',
								}}
								onClick={() => handleUser(user.id)}
								onDragOver={handleDragOver}
								onDrop={(event) => handleOnDrop(event, user.id)}>
								<h2>{user.name}</h2>
								<p className={style.userDebt}>{calculateDebt(user.transactions)}</p>
								{
									inspectUser === user.id && (
										<div>
											{user.transactions.length === 0 && <p><i>No transactions yet</i></p>}
											<ul>
												{user.transactions.slice(0, 3).map((transaction) => (
													<li className={style.userTransaction}>
														{transaction.description}: {transaction.amount}
													</li>
												))}
												{
													user.transactions.length > 3 &&
													<Link href={`/user/${user.id}`}>
														<button style={{ marginTop: "10px" }} className="button">
															View all {user.transactions.length} transactions
														</button>
													</Link>
												}
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
