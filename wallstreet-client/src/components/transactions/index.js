import style from './style.css';

import { TransactionsContext } from '../../context/TransactionsContext';

import { useContext, useEffect } from 'preact/hooks';

import parseCSV from '../../utils/parseCSV';

const CSV = `type,amount,description
deposit,10,tim
withdraw,20,"hello i need money kind regards julian"
withdraw,20,beer
deposit,10,daans`;

const Transactions = () => {
	const {
		transactions,
		setTransactions,
		selectedTransactionIds,
		setSelectedTransactionIds,
		transactionSplit,
		setTransactionSplit,
	} = useContext(TransactionsContext);

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
		<section className={style.transactions}>
			<input type="file" onChange={handleFileInputChange}></input>
			<h2 style={{ fontSize: "2rem" }}>Transactions</h2>
			<table className={style.table}>
				<thead>
					<tr style={{ textAlign: "left" }}>
						<th>Amount</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					{transactions.map((transaction) => (
						<tr
							className={style.transaction}
							style={{
								boxShadow: transaction.amount > 0 ?
									"0px 0px 0px 2px #a8cf49" :
									"0px 0px 0px 2px #f53636",
								opacity:
									selectedTransactionIds.has(transaction.id) ? "0.5" : "unset"
							}}
							onClick={() => onClickTransaction(transaction.id)}>
							<td>{transaction.amount} EUR</td>
							<td>{transaction.description}</td>
						</tr>
					))}
				</tbody>
			</table>
			<button
				className="button"
				disabled={selectedTransactionIds.size == 0}
				onClick={() => setTransactionSplit(true)}>
				Split among us
			</button>
		</section>
	);
}

export default Transactions;
