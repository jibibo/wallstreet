import { useContext } from 'preact/hooks';
import { TransactionsContext } from '../../context/TransactionsContext';

import style from './style.css';

const Transactions = () => {
	const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	];
	const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	const {
		transactions,
		selectedTransactionIds,
		setSelectedTransactionIds,
		setTransactionSplit,
	} = useContext(TransactionsContext);

	const onClickTransaction = (id) => {
		if (selectedTransactionIds.has(id)) {
			selectedTransactionIds.delete(id);
		} else {
			selectedTransactionIds.add(id);
		}

		setSelectedTransactionIds(new Set(selectedTransactionIds));
	}

	const handleDragStart = (event, transactionId) => {
		event.dataTransfer.setData("text/plain", transactionId);
	}

	const getTransactionDate = (date) => {
		const transactionDate = new Date(date);
		return `${dayNames[transactionDate.getDay()]}, ${transactionDate.getDate()} ${monthNames[transactionDate.getMonth()]}`;
	}

	return (
		<section className={style.transactions}>
			<button
				className="button"
				disabled={selectedTransactionIds.size == 0}
				onClick={() => setTransactionSplit(true)}>
				Split among us
			</button>
			<h2 style={{ fontSize: "2rem" }}>Transactions</h2>
			<table className={style.table}>
				<thead>
					<tr style={{ textAlign: "left" }}>
						<th>Date</th>
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
								boxShadow:
									selectedTransactionIds.has(transaction.id) ? "0px 0px 0px 3px white" :
										transaction.amount > 0 ?
											"0px 0px 0px 1px #a8cf49" :
											"0px 0px 0px 1px #f53636",
							}}
							onClick={() => onClickTransaction(transaction.id)}>
							<td>
								{getTransactionDate(transaction.date)}
							</td>
							<td>{transaction.amount}</td>
							<td>{transaction.description}</td>
						</tr>
					))}
				</tbody>
			</table>
		</section>
	);
}

export default Transactions;
