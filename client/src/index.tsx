import {
	AppContext,
	Button,
	FullScreenApp,
	HeaderShell,
	WithDropdownMenu,
	MenuItem,
	MenuSeparator,
} from '@guardian/threads';
import createHistory from 'history/createBrowserHistory';
import React from 'react';
import { render } from 'react-dom';
import { Redirect, Route, Router, Switch } from 'react-router-dom';
import { Dashboard } from './views/Dashboard/Dashboard';
import { Monitor } from './views/Monitor/Monitor';
import { Monitors } from './views/Monitors/Monitors';
import { Projects } from './views/Projects/Projects';
import { MdAccountCircle } from 'react-icons/md';
import { Settings } from './views/Settings/Settings';
import { Project } from './views/Project/Project';
import { TimelineEditor } from './views/TimelineEditor/TimelineEditor';

const appContext = {
	name: 'ferret',
};

export const history = createHistory();

const menu = (
	<div style={{ display: 'flex' }}>
		<Button appearance="transparent" to="/projects">
			Projects
		</Button>
		<Button appearance="transparent" to="/monitors">
			Monitors
		</Button>
	</div>
);
const toolset = (
	<WithDropdownMenu
		proxy={() => (
			<Button appearance="toolset" isDropdown icon={<MdAccountCircle />}>
				Sam Cutler
			</Button>
		)}
	>
		<MenuItem label="Settings" to="/settings" />
		<MenuItem label="Help" />
		<MenuSeparator />
		<MenuItem label="Logout" />
	</WithDropdownMenu>
);

render(
	<AppContext.Provider value={appContext}>
		<Router history={history}>
			<FullScreenApp>
				<HeaderShell withTextLogo toolset={toolset} menu={menu}>
					<Switch>
						<Route exact path="/" component={Dashboard} />
						{/* Monitors */}
						<Route exact path="/monitors" component={Monitors} />
						<Route path="/monitors/:mId" component={Monitor} />
						{/* Projects */}
						<Route
							path="/projects/:pId/timelines/:tId"
							component={TimelineEditor}
						/>
						<Route path="/projects/:pId" component={Project} />
						<Route exact path="/projects" component={Projects} />
						{/* Settings */}
						<Route exact path="/settings" component={Settings} />
						<Redirect to={{ pathname: '/' }} />
					</Switch>
				</HeaderShell>
			</FullScreenApp>
		</Router>
	</AppContext.Provider>,
	document.getElementById('root')
);
