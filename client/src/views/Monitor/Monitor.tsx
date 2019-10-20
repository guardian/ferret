import React, { FC, useState, useEffect } from 'react';
import { CenteredPage } from '@guardian/threads';
import { match } from 'react-router';
import { listMonitorTweets, getMonitor } from '../../services/monitors';
import { Monitor as MonitorType } from 'ferret-common';
import { Tweet } from '../../components/Tweet/Tweet';

import styles from './Monitor.module.css';

type MonitorProps = {
	match: match<{ pId: string; mId: string }>;
};

export const Monitor: FC<MonitorProps> = ({ match }) => {
	const [monitor, setMonitor] = useState(null as MonitorType | null);
	const [tweets, setTweets] = useState([] as any[]);
	const pId = match.params.pId;
	const mId = match.params.mId;

	useEffect(() => {
		listMonitorTweets(mId).then(m => setTweets(m));
	}, [pId, mId]);

	useEffect(() => {
		getMonitor(mId).then(m => setMonitor(m));
	}, [pId, mId]);

	return (
		<CenteredPage>
			<h1>Monitor {!!monitor && '— ' + monitor.name}</h1>
			<div className={styles.tweets}>
				{tweets.map(t => (
					<Tweet tweet={t} />
				))}
			</div>
		</CenteredPage>
	);
};
