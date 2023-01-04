import style from './style.css';

import { useContext, useEffect, useState } from "preact/hooks"

import { TransactionsContext } from '../../context/TransactionsContext';

import parseCSV from '../../utils/parseCSV';
import calculateDebt from '../../utils/calculateDebt';

const CSV = `type,amount,description
	deposit,10,tim
	withdraw,20,"hello i need money kind regards julian"
	withdraw,20,beer
	deposit,10,daans`;

const Home = () => {
	const [users, setUsers] = useState([
		{ id: 1, name: "daan", transactions: [] },
		{ id: 2, name: "tim", transactions: [] },
	]);
	
	const [transactions, setTransactions] = useContext(TransactionsContext);
	const [selectedTransactionIds, setSelectedTransactionIds] = useState(new Set());

	useEffect(() => {
		setTransactions(parseCSV(CSV));
	}, []);
	
	const onClickTransaction = (id) => {
		if (selectedTransactionIds.has(id)) {
			selectedTransactionIds.delete(id);
		} else {
			selectedTransactionIds.add(id);
		}
		
		setSelectedTransactionIds(new Set(selectedTransactionIds));
	}

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

	const handleFileInputChange = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onload = (e) => {
			const csv = e.target.result;
			setTransactions(parseCSV(csv));
		};
		reader.readAsText(file);
	}
  
	return (
		<div>
			<main className={style.main}>
				<section className={style.transactions}>
					<input type="file" onChange={handleFileInputChange}></input>
					<h2>Transactions</h2>
					<table className={style.table}>
						<thead>
							<tr style={{ textAlign: "left" }}>
								<th>Type</th>
								<th>Amount</th>
								<th>Description</th>
							</tr>
						</thead>
						<tbody>
							{transactions.map((transaction) => (
								<tr
									style={{
										border: transaction.type === "deposit" ? "1px solid green" : "1px solid red",
										backgroundColor:
											selectedTransactionIds.has(transaction.id) ? "purple" : "unset"
									}}
									className={style.transaction}
									onClick={() => onClickTransaction(transaction.id)}>
									<td>{transaction.type}</td>
									<td>{transaction.amount} EUR</td>
									<td>{transaction.description}</td>
								</tr>
							))}
						</tbody>
					</table>
				</section>
				<section className={style.users}>
					<h2>Users</h2>
					<ul>
						{users.map((user) => (
							<li onClick={() => handleUser(user.id)}>
								<h4>{user.name}</h4>
								<p>Debt: { calculateDebt(user.transactions) }</p>
							</li>
						))}
					</ul>
				</section>
			</main>
		</div>
	);
};

export default Home;
