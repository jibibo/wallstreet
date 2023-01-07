import { useState, useContext } from 'preact/hooks';
import { TransactionsContext } from '../../context/TransactionsContext';

import UserEntry from "../user";

import style from './style.css';

const Users = () => {
	const [splitUsers, setSplitUsers] = useState([]);

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

	const onClickSplit = () => {
		// Split the transactions based on the selected users
		const splitTransactions = transactions.filter((transaction) => selectedTransactionIds.has(transaction.id));

		const splitSum = splitUsers.reduce((acc, user) => acc + user.splitCount, 0);

		splitTransactions.forEach(transaction => {
			const totalAmount = transaction.amount / splitSum;
			users.forEach((user) => {
				if (user.selected) {
					let amountPerUser = totalAmount * user.splitCount;
					const newTransaction = { ...transaction };
					newTransaction.amount = Math.round((amountPerUser + Number.EPSILON) * 100) / 100;
					user.transactions.push(newTransaction);
				}
			});
		})

		users.forEach((user) => {
			user.splitCount = 0;
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

		setUsers([...users, {
			id, name,
			transactions: [],
			selected: false,
			splitCount: 0,
		}]);

		event.target.reset();
	}

	return (
		<section className={style.users}>
			{/* @TODO optimize splitUsers->splitCount check */}
			<button
				hidden={!transactionSplit}
				className="button"
				disabled={splitUsers.length === 0 || splitUsers.every(user => user.splitCount === 0)}
				onClick={onClickSplit}>
				Confirm split
			</button>
			<p hidden={!transactionSplit || splitUsers.some(user => user.splitCount > 0)}>
				At least one <i>selected</i> user should have a split greater than 0
			</p>
			<div className={style.usersHeaderContainer}>
				<h2 className={style.usersHeader}>Users</h2>
				<form className={style.form} onSubmit={addUser}>
					<input type="text" placeholder="+ &nbsp; Add user" />
				</form>
			</div>
			<div>
				<ul>
					{users.map(user =>
						<UserEntry
							user={user}
							splitUsers={splitUsers}
							setSplitUsers={setSplitUsers} />
					)}
				</ul>
			</div>
		</section>
	);
}

export default Users;
