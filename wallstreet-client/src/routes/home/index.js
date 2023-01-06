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

			// Check if transaction already exists by matching description
			const descriptions = transactions.map((transaction) => transaction.description);
			let newTransactions = parseCSV(csv);
			newTransactions = newTransactions.filter((transaction) => !descriptions.includes(transaction.description));
			setTransactions([...transactions, ...newTransactions]);
		};
		reader.readAsText(file);

		e.target.value = "";
	}

	return (
		<div>
			<div className={style.header}>
				<div>
					<button
						className="button"
						style={{ margin: "1rem" }}
						onClick={saveState}>
						Save state
					</button>
					<input className={style.fileInput} id="file" type="file" onChange={handleFileInputChange}></input>
					<label for="file">+ &nbsp; Add transactions</label>
				</div>
				{
					newChanges &&
					<p style={{ float: "right" }} className={style.pill}>You have unsaved changes!</p>
				}
			</div>
			<main className={style.main}>
				<Transactions />
				<Users />
			</main>
		</div>
	);
};

export default Home;
