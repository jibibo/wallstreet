import { useContext } from 'preact/hooks';
import Transactions from '../../components/transactions';
import Users from '../../components/users';
import { TransactionsContext } from '../../context/TransactionsContext';
import style from './style.css';

const Home = () => {
	const { transactions, users } = useContext(TransactionsContext);

	return (
		<div>
			<main className={style.main}>
				<Transactions />
				<Users />
			</main>
			<button
				className="button"
				style={{ margin: "1rem" }}
				onClick={() => {
					localStorage.setItem("transactions", JSON.stringify(transactions));
					localStorage.setItem("users", JSON.stringify(users));
				}}>
				Save state
			</button>
		</div>
	);
};

export default Home;
