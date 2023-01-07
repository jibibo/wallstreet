import { useState, useEffect, useContext } from 'preact/hooks';
import Transactions from '../../components/transactions';
import Users from '../../components/users';
import { TransactionsContext } from '../../context/TransactionsContext';
import style from './style.css';

import parseCSV from '../../utils/parseCSV';


const Home = () => {
	const { transactions, setTransactions, users } = useContext(TransactionsContext);
	const [newChanges, setNewChanges] = useState(false);

	useEffect(() => {
		let savedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
		let savedUsers = JSON.parse(localStorage.getItem('users')) || [];

		if (
			JSON.stringify([...savedTransactions, ...savedUsers]) !==
			JSON.stringify([...transactions, ...users])
		)
			setNewChanges(true);

	}, [transactions, users]);

	function saveState() {
		localStorage.setItem('transactions', JSON.stringify(transactions));
		localStorage.setItem('users', JSON.stringify(users));
		setNewChanges(false);
	}

	const handleFileInputChange = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onload = (e) => {
			const csv = e.target.result;
			parseCSV(csv)
				.then((newTransactions) => {
					// Get transaction descriptions
					const transactionDescriptions = new Set();
					transactions.forEach(transaction => {
						transactionDescriptions.add(transaction.description);
					});

					users.forEach(user => {
						user.transactions.forEach(transaction => {
							transactionDescriptions.add(transaction.description);
						});
					});

					// Check if new transactions already have these descriptions, if not, dont add
					const newTransactionsToAdd =
						newTransactions.filter(transaction => !transactionDescriptions.has(transaction.description));

					setTransactions([...transactions, ...newTransactionsToAdd]);
				});
		};
		reader.readAsText(file);

		e.target.value = "";
	}

	return (
		<div>
			<header className={style.header}>
				<div>
					<input className={style.fileInput} id="file" type="file" onChange={handleFileInputChange}></input>
					<label for="file">+ &nbsp; Add transactions</label>
				</div>
				<button
					hidden={!newChanges}
					className="button"
					onClick={saveState}>
					Save state
				</button>
			</header>
			<main className={style.main}>
				<Transactions />
				<Users />
			</main>
		</div>
	);
};

export default Home;
