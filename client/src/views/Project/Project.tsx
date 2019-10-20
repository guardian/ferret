import { CenteredPage } from '@guardian/threads';
import React, { FC } from 'react';
import { match } from 'react-router';
import { ControlBox } from '../../components/ControlBox/ControlBox';
import { MenuCard } from '../../components/MenuCard/MenuCard';
import { useProjectsState } from '../../state/ProjectsState';

type ProjectProps = {
	match: match<{ pId: string }>;
};

export const Project: FC<ProjectProps> = ({ match }) => {
	const [projects] = useProjectsState();

	const project = projects.find(p => p.id === match.params.pId);

	if (project) {
		return (
			<CenteredPage>
				<h1>{project.name}</h1>
				<ControlBox>
					<MenuCard title="New Timeline" backgroundImage="/images/plus.png" />
					<MenuCard
						disabled
						title="New Workspace"
						backgroundImage="/images/plus.png"
					/>
					<MenuCard
						disabled
						title="New Note"
						backgroundImage="/images/plus.png"
					/>
				</ControlBox>
			</CenteredPage>
		);
	} else {
		return null;
	}
};
