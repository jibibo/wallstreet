import { Router } from 'preact-router';

import { TransactionsContextProvider } from '../context/TransactionsContext';

import Home from '../routes/home';

const App = () => (
	<TransactionsContextProvider>
		<main>
			<Router>
				<Home path="/" />
			</Router>
		</main>
	</TransactionsContextProvider>
);

export default App;
