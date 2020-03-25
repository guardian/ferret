import { CenteredPage, WithModal, Button } from '@guardian/threads';
import React, { useEffect, useState } from 'react';
import { ControlBox } from '../../components/ControlBox/ControlBox';
import { MenuCard } from '../../components/MenuCard/MenuCard';
import { history } from '../../index';
import { NewProjectModal } from './NewProjectModal';
import { getProjects } from '../../services/project';
import { useProjectsState, setProjects } from '../../state/ProjectsState';
import { GridBox } from '../../components/GridBox/GridBox';

export const Projects = () => {
	const [projects, dispatch] = useProjectsState();
	const [filter, setFilter] = useState('');

	useEffect(() => {
		getProjects()
			.then(p => dispatch(setProjects(p)))
			.catch(e => console.error(e));
	}, []);

	const [createModalOpen, setCreateModalOpen] = useState(false);

	return (
		<CenteredPage>
			<h1>Projects</h1>
			<ControlBox>
				<input
					placeholder="Filter projects..."
					onChange={e => setFilter(e.target.value)}
				/>
				<WithModal
					proxy={<Button>New Project</Button>}
					isOpen={createModalOpen}
					setIsOpen={setCreateModalOpen}
				>
					<NewProjectModal
						onSuccess={() => {
							setCreateModalOpen(false);
							getProjects()
								.then(p => dispatch(setProjects(p)))
								.catch(e => console.error(e));
						}}
						onError={() => alert('Failed to create project')}
					/>
				</WithModal>
			</ControlBox>
			<GridBox emptyMessage="No projects...">
				{projects
					.filter(p => p.title.toLowerCase().startsWith(filter.toLowerCase()))
					.map(p => (
						<MenuCard
							key={p.id}
							title={p.title}
							onClick={() => history.push(`/projects/${p.id}`)}
							backgroundImage={p.image}
						/>
					))}
			</GridBox>
		</CenteredPage>
	);
};
