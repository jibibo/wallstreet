import { Router } from 'preact-router';

import { TransactionsContextProvider } from '../context/TransactionsContext';

import Home from '../routes/home';

const App = () => (
	<TransactionsContextProvider>
		<div id="app">
			<main>
				<Router>
					<Home path="/" />
				</Router>
			</main>
		</div>
	</TransactionsContextProvider>
);

export default App;
