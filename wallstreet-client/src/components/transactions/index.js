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
			setTransactions(parseCSV(csv));
		};
		reader.readAsText(file);
	}
	
	return (
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
	);
}

export default Transactions;