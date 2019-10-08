import React from 'react';
import { AppContext, HeaderShell, FullScreenApp } from '@guardian/threads';
import createHistory from 'history/createBrowserHistory';
import { render } from 'react-dom';
import { Router, Route, Redirect } from 'react-router-dom';
import { Monitors } from './views/Monitors/Monitors';
import { Projects } from './views/Projects/Projects';

const appContext = {
	name: 'OSMON',
};

export const history = createHistory();

render(
	<AppContext.Provider value={appContext}>
		<Router history={history}>
			<FullScreenApp>
				<HeaderShell withTextLogo>
					<Route path="/projects/:projectId" component={Monitors} />
					<Route exact path="/projects" component={Projects} />
					<Redirect to={{ pathname: '/projects' }} />
				</HeaderShell>
			</FullScreenApp>
		</Router>
	</AppContext.Provider>,
	document.getElementById('root')
);
