import { Router } from 'preact-router';

import { TransactionsContextProvider } from '../context/TransactionsContext';

import Header from './header';

// Code-splitting is automated for `routes` directory
import Home from '../routes/home';
import Profile from '../routes/profile';

const App = () => (
	<TransactionsContextProvider>
		<div id="app">
			<Header />
			<main>
				<Router>
					<Home path="/" />
					<Profile path="/profile/" user="me" />
					<Profile path="/profile/:user" />
				</Router>
			</main>
		</div>
	</TransactionsContextProvider>
);

export default App;
