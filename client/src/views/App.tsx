import {
	Button,
	HeaderShell,
	MenuItem,
	MenuSeparator,
	WithDropdownMenu,
} from '@guardian/threads';
import React from 'react';
import { MdAccountCircle } from 'react-icons/md';
import { Redirect, Route, Switch } from 'react-router';
import { clearToken, useAuthState } from '../state/AuthState';
import { Dashboard } from './Dashboard/Dashboard';
import { Login } from './Login/Login';
import { Monitor } from './Monitor/Monitor';
import { Monitors } from './Monitors/Monitors';
import { Project } from './Project/Project';
import { Projects } from './Projects/Projects';
import { Settings } from './Settings/Settings';
import { TimelineEditor } from './TimelineEditor/TimelineEditor';

export const App = () => {
	const [{ token, user }, dispatch] = useAuthState();

	const isAuthed = !!token;

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
					{user ? user.displayName : '<Unknown User>'}
				</Button>
			)}
		>
			<MenuItem label="Settings" to="/settings" />
			<MenuItem label="Help" disabled />
			<MenuSeparator />
			<MenuItem
				label="Logout"
				onClick={() => {
					dispatch(clearToken());
				}}
			/>
		</WithDropdownMenu>
	);

	return (
		<HeaderShell
			withTextLogo
			toolset={isAuthed ? toolset : undefined}
			menu={isAuthed ? menu : undefined}
		>
			<Switch>
				{isAuthed ? (
					<>
						{/* Dashboard */}
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
					</>
				) : (
					<>
						<Route exact path="/login" component={Login} />
						<Redirect to={{ pathname: '/login' }} />
					</>
				)}
			</Switch>
		</HeaderShell>
	);
};
