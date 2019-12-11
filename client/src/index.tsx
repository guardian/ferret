import { AppContext, FullScreenApp } from '@guardian/threads';
import { createBrowserHistory } from 'history';
import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router-dom';
import { App } from './views/App';
import { AuthProvider } from './state/AuthState';
import { ProjectsProvider } from './state/ProjectsState';

const appContext = {
	name: 'ferret',
	logoSvg: 'ferret.svg',
};

export const history = createBrowserHistory();

render(
	<AppContext.Provider value={appContext}>
		<ProjectsProvider>
			<AuthProvider>
				<Router history={history}>
					<FullScreenApp>
						<App />
					</FullScreenApp>
				</Router>
			</AuthProvider>
		</ProjectsProvider>
	</AppContext.Provider>,
	document.getElementById('root')
);
