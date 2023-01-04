import Transactions from '../../components/transactions';
import Users from '../../components/users';
import style from './style.css';

const Home = () => {
	return (
		<div>
			<main className={style.main}>
				<Transactions />
				<Users />
			</main>
		</div>
	);
};

export default Home;
