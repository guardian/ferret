import React, { FC, useState, useEffect } from 'react';
import { CenteredPage, Table, Button, WithModal } from '@guardian/threads';
import { NewMonitorModal } from './NewMonitorModal';
import { Monitor } from '@guardian/ferret-common';
import { listMonitors } from '../../services/monitors';
import { match } from 'react-router';
import { Link } from 'react-router-dom';

import styles from './Monitors.module.css';

type MonitorsProps = {
	match: match<{ pId: string }>;
};
export const Monitors: FC<MonitorsProps> = ({ match }) => {
	const [newModalOpen, setNewModalOpen] = useState(false);

	const [monitors, setMonitors] = useState([] as Monitor[]);
	const pId = match.params.pId;

	useEffect(() => {
		listMonitors().then(m => setMonitors(m));
	}, [pId]);

	return (
		<CenteredPage>
			<h1>Monitors</h1>
			<div className={styles.controls}>
				<input type="text" placeholder="Filter..." />
				<WithModal
					isOpen={newModalOpen}
					setIsOpen={setNewModalOpen}
					proxy={() => <Button>New Monitor</Button>}
				>
					<NewMonitorModal
						onSuccess={() => {
							setNewModalOpen(false);
							listMonitors().then(m => setMonitors(m));
						}}
						onError={() => alert('Failed to create monitor')}
					/>
				</WithModal>
			</div>

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
								<td>
									<Link to={`/monitors/${m.id}`}>{m.name}</Link>
								</td>
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
