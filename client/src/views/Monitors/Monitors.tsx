import React, { FC, useState } from 'react';
import {
	CenteredPage,
	Table,
	Button,
	WithModal,
	Form,
	FormRow,
	Panel,
} from '@guardian/threads';
import { NewMonitorModal } from './NewMonitorModal';

export const Monitors: FC<{}> = () => {
	const [newModalOpen, setNewModalOpen] = useState(false);

	return (
		<CenteredPage>
			<h1>Controls</h1>
			<WithModal
				isOpen={newModalOpen}
				setIsOpen={setNewModalOpen}
				proxy={() => <Button>New Monitor</Button>}
			>
				<NewMonitorModal onSuccess={() => {}} />
			</WithModal>
			<h1>Monitors</h1>
			<p>
				<input type="text" placeholder="Filter..." />
			</p>

			<Table style={{ width: '100%' }}>
				<thead>
					<tr>
						<th>Monitor</th>
						<th>Last Updated</th>
						<th>Count</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>#TwitterKurds</td>
						<td>{new Date().toLocaleString()}</td>
						<td>{Math.floor(Math.random() * 1000)}</td>
					</tr>
				</tbody>
			</Table>
		</CenteredPage>
	);
};
