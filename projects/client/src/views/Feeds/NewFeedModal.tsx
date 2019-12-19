import React, { FC, useState } from 'react';
import { Panel, Form, FormRow, Button } from '@guardian/threads';
import { createFeed } from '../../services/feeds';
import { Radio } from '../../components/RadioImage/RadioImage';

import styles from './NewFeedModal.module.css';

type NewFeedModalProps = {
	onSuccess: () => void;
	onError: () => void;
};

export const NewFeedModal: FC<NewFeedModalProps> = ({ onSuccess, onError }) => {
	const [name, setName] = useState('');
	const [feedType, setFeedType] = useState(undefined as string | undefined);
	const [query, setQuery] = useState('');
	const [frequency, setFrequency] = useState('');
	// const frequencyIsValid = () => {
	// const cron = //
	// }

	const renderFields = () => {
		switch (feedType) {
			case 'grid':
			case 'twitter':
				return (
					<FormRow title="Query">
						<input
							type="text"
							placeholder="Enter query..."
							value={query}
							onChange={e => setQuery(e.target.value)}
						/>
					</FormRow>
				);
			default:
				return <div>Select a feed type</div>;
		}
	};

	const minutely = '* * * * *';
	const tenMinutes = '*/10 * * * *';
	const hourly = '0 * * * *';
	const daily = '0 0 * * *';
	const weekly = '0 0 * * 1';

	return (
		<Panel title="Add Feed">
			<Form
				onSubmit={() => {
					if (feedType === 'grid') {
						createFeed(name, feedType, frequency, { query })
							.then(onSuccess)
							.catch(onError);
					} else {
						alert('unknown type: ' + feedType);
					}
				}}
			>
				<FormRow title="Name">
					<input
						type="text"
						autoComplete="off"
						placeholder="Enter name..."
						autoFocus
						value={name}
						onChange={e => setName(e.target.value)}
					/>
				</FormRow>
				<FormRow title="Run Every...">
					<div className={styles.frequencyGroup}>
						<Radio
							name="period"
							value={minutely}
							label="Minute"
							checked={frequency === minutely}
							onChange={e => setFrequency(e.target.value)}
						/>
						<Radio
							name="period"
							value={tenMinutes}
							label="10 Minutes"
							checked={frequency === tenMinutes}
							onChange={e => setFrequency(e.target.value)}
						/>
						<Radio
							name="period"
							value={hourly}
							label="Hour"
							checked={frequency === hourly}
							onChange={e => setFrequency(e.target.value)}
						/>
						<Radio
							name="period"
							value={daily}
							label="Day"
							checked={frequency === daily}
							onChange={e => setFrequency(e.target.value)}
						/>
						<Radio
							name="period"
							value={weekly}
							label="Monday"
							checked={frequency === weekly}
							onChange={e => setFrequency(e.target.value)}
						/>
					</div>
					<input
						type="text"
						placeholder="Custom Schedule"
						value={frequency}
						onChange={e => setFrequency(e.target.value)}
					/>
				</FormRow>
				<FormRow title="Type">
					<select value={feedType} onChange={e => setFeedType(e.target.value)}>
						<option>Select type</option>
						<option value="grid">Grid</option>
						<option value="twitter" disabled>
							Twitter
						</option>
					</select>
				</FormRow>
				{renderFields()}
				<FormRow horizontal>
					<Button
						type="submit"
						disabled={!name || !feedType || !query || !frequency}
					>
						Create
					</Button>
				</FormRow>
			</Form>
		</Panel>
	);
};
