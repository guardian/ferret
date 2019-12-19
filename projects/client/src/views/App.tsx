import {
	Button,
	HeaderShell,
	MenuItem,
	MenuSeparator,
	WithDropdownMenu,
} from '@guardian/threads';
import React from 'react';
import { MdAccountCircle, MdFolderOpen, MdRssFeed } from 'react-icons/md';
import { TiBell, TiFlowChildren } from 'react-icons/ti';
import { FiDatabase } from 'react-icons/fi';
import { Redirect, Route, Switch } from 'react-router';
import { clearToken, useAuthState } from '../state/AuthState';
import { Dashboard } from './Dashboard/Dashboard';
import { Login } from './Login/Login';
import { Feeds } from './Feeds/Feeds';
import { Project } from './Project/Project';
import { Projects } from './Projects/Projects';
import { Settings } from './Settings/Settings';
import { TimelineEditor } from './TimelineEditor/TimelineEditor';

export const App = () => {
	const [{ token, user }, dispatch] = useAuthState();

	const isAuthed = !!token;

	const menu = (
		<div style={{ display: 'flex' }}>
			<Button appearance="transparent" to="/projects" icon={<MdFolderOpen />}>
				Projects
			</Button>
			<Button appearance="transparent" to="/datasets" icon={<FiDatabase />}>
				Datasets
			</Button>
			<Button appearance="transparent" to="/feeds" icon={<MdRssFeed />}>
				Feeds
			</Button>
			<Button appearance="transparent" to="/alerts" icon={<TiBell />}>
				Alerts
			</Button>
			<Button appearance="transparent" to="/entities" icon={<TiFlowChildren />}>
				Entities
			</Button>
		</div>
	);

	const toolset = (
		<WithDropdownMenu
			proxy={
				<Button appearance="toolset" isDropdown icon={<MdAccountCircle />}>
					{user ? user.displayName : '<Unknown User>'}
				</Button>
			}
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

						{/* Feeds */}
						<Route exact path="/feeds" component={Feeds} />

						{/* Projects */}
						<Route
							exact
							path="/projects/:pId/timelines/:tId"
							component={TimelineEditor}
						/>
						<Route exact path="/projects/:pId" component={Project} />
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
