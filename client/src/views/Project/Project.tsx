import React from 'react';
import {
	CenteredPage,
	PageWithSidebar,
	Menu,
	MenuItem,
	MenuTitle,
} from '@guardian/threads';
import { ProjectCard } from '../../components/ProjectCard/ProjectCard';

import styles from './Project.module.css';
import { ControlBox } from '../../components/ControlBox/ControlBox';

export const Project = () => {
	return (
		<CenteredPage>
			<h1>UK General Election</h1>
			<ControlBox>
				<ProjectCard title="New Timeline" backgroundColor="red" />
				<ProjectCard disabled title="New Workspace" backgroundColor="red" />
				<ProjectCard disabled title="New Note" backgroundColor="red" />
			</ControlBox>
		</CenteredPage>
	);
};
