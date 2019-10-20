import { CenteredPage, WithModal } from '@guardian/threads';
import React, { useEffect, useState } from 'react';
import { ControlBox } from '../../components/ControlBox/ControlBox';
import { MenuCard } from '../../components/MenuCard/MenuCard';
import { history } from '../../index';
import { NewProjectModal } from './NewProjectModal';
import styles from './Projects.module.css';
import { getProjects } from '../../services/project';
import { useProjectsState, setProjects } from '../../state/ProjectsState';

export const Projects = () => {
	const [projects, dispatch] = useProjectsState();

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
				<WithModal
					proxy={() => (
						<MenuCard title="New Project" backgroundImage="/images/plus.png" />
					)}
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
			<h2>Recent Projects</h2>
			<div className={styles.cardContainer}>
				<div className={styles.cards}>
					{projects.map(p => (
						<MenuCard
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
