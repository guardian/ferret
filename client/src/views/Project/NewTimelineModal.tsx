import React, { useState, FC } from 'react';
import { Panel, Form, FormRow, Button } from '@guardian/threads';
import { createProject, createTimeline } from '../../services/project';
import { MenuCard } from '../../components/MenuCard/MenuCard';

import styles from './Project.module.css';

type NewTimelineModalProps = {
	pId: string;
	onSuccess: () => void;
	onError: () => void;
};
export const NewTimelineModal: FC<NewTimelineModalProps> = ({
	pId,
	onSuccess,
	onError,
}) => {
	const [processing, setProcessing] = useState(false);
	const [newName, setNewName] = useState('');
	const [newImage, setNewImage] = useState('/kobane.jpeg');

	return (
		<Panel title="New Timeline">
			<Form
				onSubmit={() => {
					setProcessing(true);
					createTimeline(pId, newName, newImage)
						.then(() => {
							setProcessing(false);
							onSuccess();
						})
						.catch(() => {
							setProcessing(false);
							onError();
						});
				}}
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
						<MenuCard
							title={newName}
							onClick={() => {}}
							backgroundImage={newImage}
						/>
					</div>
				</FormRow>
				<FormRow horizontal>
					<Button
						type="submit"
						disabled={!newName || !newImage || processing}
						showSpinner={processing}
					>
						Create
					</Button>
				</FormRow>
			</Form>
		</Panel>
	);
};
