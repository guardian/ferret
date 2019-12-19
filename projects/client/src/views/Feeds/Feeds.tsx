import React, { FC, useState, useEffect } from 'react';
import { CenteredPage, Table, Button, WithModal } from '@guardian/threads';
import { NewFeedModal } from './NewFeedModal';
import { Feed } from '@guardian/ferret-common';
import { listFeeds } from '../../services/feeds';
import { match } from 'react-router';
import { Link } from 'react-router-dom';

import styles from './Feeds.module.css';

type FeedsProps = {
	match: match<{ pId: string }>;
};
export const Feeds: FC<FeedsProps> = ({ match }) => {
	const [newModalOpen, setNewModalOpen] = useState(false);

	const [feeds, setFeeds] = useState([] as Feed[]);
	const pId = match.params.pId;

	useEffect(() => {
		listFeeds().then(m => setFeeds(m));
	}, [pId]);

	return (
		<CenteredPage>
			<h1>Feeds</h1>
			<div className={styles.controls}>
				<input type="text" placeholder="Filter..." />
				<WithModal
					isOpen={newModalOpen}
					setIsOpen={setNewModalOpen}
					proxy={<Button>New Feed</Button>}
				>
					<NewFeedModal
						onSuccess={() => {
							setNewModalOpen(false);
							listFeeds().then(m => setFeeds(m));
						}}
						onError={() => alert('Failed to create feed')}
					/>
				</WithModal>
			</div>

			<Table style={{ width: '100%' }}>
				<thead>
					<tr>
						<th>Name</th>
						<th>Type</th>
					</tr>
				</thead>
				<tbody>
					{feeds.map(m => {
						return (
							<tr>
								<td>
									<Link to={`/feeds/${m.id}`}>{m.title}</Link>
								</td>
								<td>{m.type}</td>
							</tr>
						);
					})}
				</tbody>
			</Table>
		</CenteredPage>
	);
};
