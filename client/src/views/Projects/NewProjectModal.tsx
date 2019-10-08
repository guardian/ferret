import React, { useState, FC } from 'react';
import { Panel, Form, FormRow, Button } from '@guardian/threads';
import { createProject } from '../../services/project';
import { ProjectCard } from '../../components/ProjectCard/ProjectCard';

import styles from './Projects.module.css';

type NewProjectModalProps = {
	onSuccess: () => void;
	onError: () => void;
};
export const NewProjectModal: FC<NewProjectModalProps> = ({
	onSuccess,
	onError,
}) => {
	const [newName, setNewName] = useState('');
	const [newImage, setNewImage] = useState('/kobane.jpeg');

	return (
		<Panel title="New Project">
			<Form
				onSubmit={() =>
					createProject(newName, newImage)
						.then(onSuccess)
						.catch(onError)
				}
			>
				<FormRow title="Name">
					<input
						type="text"
						autoFocus
						value={newName}
						onChange={e => setNewName(e.target.value)}
					/>
				</FormRow>
				<FormRow title="Image">
					<input
						type="text"
						disabled
						value={newImage}
						onChange={e => setNewImage(e.target.value)}
					/>
				</FormRow>
				<FormRow title="Preview">
					<div className={styles.previewCard}>
						<ProjectCard
							title={newName}
							onClick={() => {}}
							backgroundImage={newImage}
						/>
					</div>
				</FormRow>
				<FormRow horizontal>
					<Button type="submit" disabled={!newName || !newImage}>
						Create
					</Button>
				</FormRow>
			</Form>
		</Panel>
	);
};
