import React, { FC, useState } from 'react';
import { Panel, Form, FormRow, Button } from '@guardian/threads';
import { createMonitor } from '../../services/monitors';

import styles from './NewMonitorModal.module.css';

type NewMonitorModalProps = {
	projectId: string;
	onSuccess: () => void;
	onError: () => void;
};

export const NewMonitorModal: FC<NewMonitorModalProps> = ({
	projectId,
	onSuccess,
	onError,
}) => {
	const [newName, setNewName] = useState('');
	const [newQuery, setNewQuery] = useState('');

	return (
		<Panel title="Add Monitor">
			<Form
				onSubmit={() => {
					createMonitor(projectId, newName, newQuery)
						.then(onSuccess)
						.catch(onError);
				}}
			>
				<FormRow title="Name">
					<input
						type="text"
						placeholder="Name"
						autoFocus
						value={newName}
						onChange={e => setNewName(e.target.value)}
					/>
				</FormRow>
				<FormRow title="Query">
					<input
						type="text"
						placeholder="Query"
						value={newQuery}
						onChange={e => setNewQuery(e.target.value)}
					/>
					<small className={styles.rateWarning}>
						Please don't waste our rate limit!
					</small>
				</FormRow>
				<FormRow horizontal>
					<Button type="submit" disabled={!newName || !newQuery}>
						Create
					</Button>
				</FormRow>
			</Form>
		</Panel>
	);
};
