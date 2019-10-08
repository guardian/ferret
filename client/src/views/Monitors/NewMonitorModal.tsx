import React, { FC, useState } from 'react';
import { Panel, Form, FormRow, Button } from '@guardian/threads';

type NewMonitorModalProps = {
	onSuccess: () => void;
};

export const NewMonitorModal: FC<NewMonitorModalProps> = () => {
	const [newName, setNewName] = useState('');
	const [newQuery, setNewQuery] = useState('');

	return (
		<Panel title="Add Monitor">
			<Form onSubmit={() => {}}>
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
						autoFocus
						value={newQuery}
						onChange={e => setNewQuery(e.target.value)}
					/>
				</FormRow>
				<FormRow horizontal>
					<Button type="submit" disabled={false}>
						Create
					</Button>
				</FormRow>
			</Form>
		</Panel>
	);
};
