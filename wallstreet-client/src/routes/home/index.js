import { useState, useEffect, useContext } from 'preact/hooks';
import Transactions from '../../components/transactions';
import Users from '../../components/users';
import { TransactionsContext } from '../../context/TransactionsContext';
import style from './style.css';

const Home = () => {
	const { transactions, users } = useContext(TransactionsContext);
	const [oldState, setOldState] = useState("");

	useEffect(() => {
		if (oldState === "" || oldState === "[]")
			setOldState(JSON.stringify([...transactions, ...users]));
	}, [transactions, users]);

	function saveState() {
		localStorage.setItem('transactions', JSON.stringify(transactions));
		localStorage.setItem('users', JSON.stringify(users));
		setOldState(JSON.stringify([...transactions, ...users]));
	}

	return (
		<div>
			<button
				className="button"
				style={{ margin: "1rem" }}
				onClick={saveState}>
				Save state
			</button>
			{
				oldState !== JSON.stringify([...transactions, ...users]) &&
				<p className={style.pill}>You have unsaved changes</p>
			}
			<main className={style.main}>
				<Transactions />
				<Users />
			</main>
		</div>
	);
};

export default Home;
