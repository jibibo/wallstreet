import style from './style.css';

import { TransactionsContext } from '../../context/TransactionsContext';

import { useContext, useEffect } from 'preact/hooks';

const Transactions = () => {
	const {
		transactions,
		setTransactions,
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
