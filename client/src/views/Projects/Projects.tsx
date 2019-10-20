import { Button, CenteredPage, WithModal } from '@guardian/threads';
import { Project } from 'ferret-common';
import React, { useEffect, useState } from 'react';
import { ProjectCard } from '../../components/ProjectCard/ProjectCard';
import { history } from '../../index';
import { getProjects } from '../../services/project';
import { NewProjectModal } from './NewProjectModal';
import styles from './Projects.module.css';
import { MdCreateNewFolder } from 'react-icons/md';
import { ControlBox } from '../../components/ControlBox/ControlBox';

export const Projects = () => {
	const [projects, setProjects] = useState([] as Project[]);
	useEffect(() => {
		//getProjects().then(p => setProjects(p));
	}, []);

	const p = [
		{ id: '123', name: 'project', image: '/kobane.jpeg' },
		{ id: '123', name: 'project', image: '/kobane.jpeg' },
		{ id: '123', name: 'project', image: '/kobane.jpeg' },
		{ id: '123', name: 'project', image: '/kobane.jpeg' },
		{ id: '123', name: 'project', image: '/kobane.jpeg' },
		{ id: '123', name: 'project', image: '/kobane.jpeg' },
	];
	const [createModalOpen, setCreateModalOpen] = useState(false);

	return (
		<CenteredPage>
			<ControlBox>
				<WithModal
					proxy={() => (
						<ProjectCard title="New Project" backgroundColor="red" />
					)}
					isOpen={createModalOpen}
					setIsOpen={setCreateModalOpen}
				>
					<NewProjectModal
						onSuccess={() => {
							setCreateModalOpen(false);
							//getProjects().then(p => setProjects(p));
						}}
						onError={() => alert('Failed to create project')}
					/>
				</WithModal>
			</ControlBox>
			<h2>Recent Projects</h2>
			<div className={styles.cardContainer}>
				<div className={styles.cards}>
					{p.map(p => (
						<ProjectCard
							key={p.id}
							title={p.name}
							onClick={() => history.push(`/projects/${p.id}`)}
							backgroundImage={p.image}
						/>
					))}
				</div>
			</div>
		</CenteredPage>
	);
};
