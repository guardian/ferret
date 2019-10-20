import { AppContext, FullScreenApp } from '@guardian/threads';
import { createBrowserHistory } from 'history';
import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router-dom';
import { App } from './views/App';
import { AuthProvider } from './state/AuthState';

const appContext = {
	name: 'ferret',
};

export const history = createBrowserHistory();

render(
	<AppContext.Provider value={appContext}>
		<AuthProvider>
			<Router history={history}>
				<FullScreenApp>
					<App />
				</FullScreenApp>
			</Router>
		</AuthProvider>
	</AppContext.Provider>,
	document.getElementById('root')
);
