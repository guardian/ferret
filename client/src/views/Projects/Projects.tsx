import { Button, CenteredPage, WithModal } from '@guardian/threads';
import React, { useEffect, useState } from 'react';
import { ProjectCard } from '../../components/ProjectCard/ProjectCard';
import { history } from '../../index';
import { Project } from '../../model/Project';
import { getProjects } from '../../services/project';
import { NewProjectModal } from './NewProjectModal';
import styles from './Projects.module.css';
import { Tweet } from '../../components/Tweet/Tweet';

export const Projects = () => {
	const [projects, setProjects] = useState([] as Project[]);
	useEffect(() => {
		getProjects().then(p => setProjects(p));
	}, []);

	const [createModalOpen, setCreateModalOpen] = useState(false);

	return (
		<CenteredPage>
			<h1>Projects</h1>
			<WithModal
				proxy={() => <Button>New Project</Button>}
				isOpen={createModalOpen}
				setIsOpen={setCreateModalOpen}
			>
				<NewProjectModal
					onSuccess={() => {
						setCreateModalOpen(false);
						getProjects().then(p => setProjects(p));
					}}
					onError={() => alert('Failed to create project')}
				/>
			</WithModal>
			<hr />
			<Tweet media="" />
			<div className={styles.cardContainer}>
				{projects.map(p => (
					<ProjectCard
						key={p.id}
						title={p.name}
						onClick={() => history.push(`/projects/${p.id}`)}
						backgroundImage={p.image}
					/>
				))}
			</div>
		</CenteredPage>
	);
};
