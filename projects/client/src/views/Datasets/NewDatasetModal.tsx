import React, { useState, useEffect, FC } from 'react';
import { Panel, Form, FormRow, Button } from '@guardian/threads';
import { createDataset } from '../../services/datasets';
import { MenuCard } from '../../components/MenuCard/MenuCard';
import styles from './NewDatasetModal.module.css';
import { searchImages } from '../../services/images';
import { ImagePicker } from '../../components/ImagePicker/ImagePicker';
import { CenterBox } from '../../components/CenterBox/CenterBox';

type NewDatasetModalProps = {
	onSuccess: () => void;
	onError: () => void;
};
export const NewDatasetModal: FC<NewDatasetModalProps> = ({
	onSuccess,
	onError,
}) => {
	const [processing, setProcessing] = useState(false);
	const [newName, setNewName] = useState('');
	const [newImage, setNewImage] = useState('/kobane.jpeg');

	return (
		<Panel title="New Dataset">
			<Form
				onSubmit={() => {
					setProcessing(true);
					createDataset(newName, newImage)
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
