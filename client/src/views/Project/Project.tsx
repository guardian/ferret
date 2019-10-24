import { Timeline } from '@guardian/ferret-common';
import { CenteredPage, WithModal } from '@guardian/threads';
import React, { FC, useEffect, useState } from 'react';
import { match } from 'react-router';
import { ControlBox } from '../../components/ControlBox/ControlBox';
import { MenuCard } from '../../components/MenuCard/MenuCard';
import { history } from '../../index';
import { getTimelines } from '../../services/project';
import { useProjectsState } from '../../state/ProjectsState';
import { NewTimelineModal } from './NewTimelineModal';
import styles from './Project.module.css';

type ProjectProps = {
	match: match<{ pId: string }>;
};

export const Project: FC<ProjectProps> = ({ match }) => {
	// Projects from reducer
	const [projects] = useProjectsState();

	// Timelines stored locally
	const [timelineModalOpen, setTimelineModalOpen] = useState(false);
	const [timelines, setTimelines] = useState([] as Timeline[]);

	const project = projects.find(p => p.id === match.params.pId);

	useEffect(() => {
		if (project) {
			getTimelines(project.id)
				.then(p => setTimelines(p))
				.catch(e => console.error(e));
		}
	}, []);

	if (project) {
		return (
			<CenteredPage>
				<h1>{project.title}</h1>
				<ControlBox>
					<WithModal
						proxy={() => (
							<MenuCard
								title="New Timeline"
								backgroundImage="/images/plus.png"
							/>
						)}
						isOpen={timelineModalOpen}
						setIsOpen={setTimelineModalOpen}
					>
						<NewTimelineModal
							pId={project.id}
							onSuccess={() => {
								setTimelineModalOpen(false);
								getTimelines(project.id)
									.then(timelines => setTimelines(timelines))
									.catch(e => console.error(e));
							}}
							onError={() => alert('Failed to create project')}
						/>
					</WithModal>
				</ControlBox>
				<h2>Recent Projects</h2>
				<div className={styles.cardContainer}>
					<div className={styles.cards}>
						{timelines.map(t => (
							<MenuCard
								key={t.id}
								title={t.title}
								onClick={() =>
									history.push(`/projects/${project.id}/timelines/${t.id}`)
								}
								backgroundImage={t.image}
							/>
						))}
					</div>
				</div>
			</CenteredPage>
		);
	} else {
		return null;
	}
};
