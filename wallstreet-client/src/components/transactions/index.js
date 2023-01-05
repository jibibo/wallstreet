import style from './style.css';

import { TransactionsContext } from '../../context/TransactionsContext';

import { useContext, useEffect } from 'preact/hooks';

import parseCSV from '../../utils/parseCSV';

const Transactions = () => {
	const {
		transactions,
		setTransactions,
		selectedTransactionIds,
		setSelectedTransactionIds,
		setTransactionSplit,
	} = useContext(TransactionsContext);

	useEffect(() => {
		const storedTransactions = localStorage.getItem("transactions");
		if (storedTransactions) {
			setTransactions(JSON.parse(storedTransactions));
			return;
		}
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

	const handleDragStart = (event, transactionId) => {
		event.dataTransfer.setData("text/plain", transactionId);
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
							draggable
							onDragStart={(event) => handleDragStart(event, transaction.id)}
							className={style.transaction}
							style={{
								boxShadow: transaction.amount > 0 ?
									"0px 0px 0px 1px #a8cf49" :
									"0px 0px 0px 1px #f53636",
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
