import React, { FC, useState, useEffect } from 'react';
import { CenteredPage, Table, Button, WithModal } from '@guardian/threads';
import { NewMonitorModal } from './NewMonitorModal';
import { Monitor } from '../../model/Monitor';
import { listMonitors } from '../../services/monitors';
import { match } from 'react-router';

type MonitorsProps = {
	match: match<{ pId: string }>;
};
export const Monitors: FC<MonitorsProps> = ({ match }) => {
	const [newModalOpen, setNewModalOpen] = useState(false);

	const [monitors, setMonitors] = useState([] as Monitor[]);
	const pId = match.params.pId;

	useEffect(() => {
		listMonitors(pId).then(m => setMonitors(m));
	}, [pId]);

	return (
		<CenteredPage>
			<h1>Controls</h1>
			<WithModal
				isOpen={newModalOpen}
				setIsOpen={setNewModalOpen}
				proxy={() => <Button>New Monitor</Button>}
			>
				<NewMonitorModal
					pId={pId}
					onSuccess={() => {
						setNewModalOpen(false);
						listMonitors(pId).then(m => setMonitors(m));
					}}
					onError={() => alert('Failed to create monitor')}
				/>
			</WithModal>
			<h1>Monitors</h1>
			<p>
				<input type="text" placeholder="Filter..." />
			</p>

			<Table style={{ width: '100%' }}>
				<thead>
					<tr>
						<th>Name</th>
						<th>Query</th>
						<th>Last Updated</th>
						<th>Count</th>
					</tr>
				</thead>
				<tbody>
					{monitors.map(m => {
						return (
							<tr>
								<td>{m.name}</td>
								<td>{m.query}</td>
								<td>{new Date().toLocaleString()}</td>
								<td>{Math.floor(Math.random() * 1000)}</td>
							</tr>
						);
					})}
				</tbody>
			</Table>
		</CenteredPage>
	);
};
