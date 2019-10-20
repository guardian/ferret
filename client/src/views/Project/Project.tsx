import { CenteredPage } from '@guardian/threads';
import React from 'react';
import { ControlBox } from '../../components/ControlBox/ControlBox';
import { ProjectCard } from '../../components/ProjectCard/ProjectCard';

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
