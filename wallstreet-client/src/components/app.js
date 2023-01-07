import { Router } from 'preact-router';
import { TransactionsContextProvider } from '../context/TransactionsContext';


import Home from '../routes/home';
import User from '../routes/user';

const App = () => (
	<TransactionsContextProvider>
		<main>
			<Router>
				<Home path="/" />
				<User path="/user/:id" />
			</Router>
		</main>
	</TransactionsContextProvider>
);

export default App;
