import React, { useState, FC } from 'react';
import { Panel, Form, FormRow, Button } from '@guardian/threads';
import { createProject } from '../../services/project';
import { MenuCard } from '../../components/MenuCard/MenuCard';

import styles from './Projects.module.css';
import { ImagePicker } from '../../components/ImagePicker/ImagePicker';
import { CenterBox } from '../../components/CenterBox/CenterBox';

type NewProjectModalProps = {
	onSuccess: () => void;
	onError: () => void;
};
export const NewProjectModal: FC<NewProjectModalProps> = ({
	onSuccess,
	onError,
}) => {
	const [processing, setProcessing] = useState(false);
	const [newName, setNewName] = useState('');
	const [newImage, setNewImage] = useState('/kobane.jpeg');

	return (
		<Panel title="New Project">
			<Form
				onSubmit={() => {
					setProcessing(true);
					createProject(newName, newImage)
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
					<ImagePicker onChange={setNewImage} />
				</FormRow>
				<FormRow title="Preview">
					<CenterBox>
						<MenuCard
							title={newName}
							onClick={() => {}}
							backgroundImage={newImage}
						/>
					</CenterBox>
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
