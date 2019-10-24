import { Button, SortableList } from '@guardian/threads';
import React, { FC, useState, useEffect } from 'react';
import { MdAddCircle } from 'react-icons/md';
import { EntryCard } from './EntryCard';
import styles from './Timeline.module.css';
import { TimelineEntry } from '@guardian/ferret-common';
import {
	getTimelineEntries,
	updateTimelineEntry,
	createTimelineEntry,
	reorderTimelineEntries,
} from '../../services/project';
import _ from 'lodash';

type TimelineProps = { pId: string; tId: string };

export const TimelineEntriesEditor: FC<TimelineProps> = ({ pId, tId }) => {
	const [fetchingEntries, setFetchingEntries] = useState(true);

	const [entries, setEntries] = useState([] as TimelineEntry[]);

	const getEntries = () => {
		setFetchingEntries(true);
		getTimelineEntries(pId, tId)
			.then(e => {
				setFetchingEntries(false);
				setEntries(e);
			})
			.catch(e => console.error(e));
	};
	useEffect(() => {
		getEntries();
	}, [tId]);

	const debouncedServerUpdate = _.debounce(updateTimelineEntry, 1000);

	const updateEvent = (entry: TimelineEntry) => {
		const newEntries = [...entries];
		const i = entries.findIndex(e => e.id === entry.id);
		newEntries[i] = entry;
		debouncedServerUpdate(pId, tId, entry.id, entry);
		setEntries(newEntries);
	};

	const deleteEvent = (remove: number) => {
		setEntries(entries.filter((_, i) => i !== remove));
	};

	return (
		<div className={styles.container}>
			<div className={styles.controls}>
				<Button
					onClick={() =>
						createTimelineEntry(
							pId,
							tId,
							new Date(),
							'New Event',
							'Description...',
							[]
						).then(getEntries)
					}
					icon={<MdAddCircle />}
				/>
			</div>
			<div className={styles.timeline}>
				<SortableList
					hasOwnDragRegion
					onUpdate={(from, to) => {
						let newEntries = [...entries];
						newEntries.splice(to, 0, ...newEntries.splice(from, 1));
						setEntries(newEntries);

						reorderTimelineEntries(pId, tId, newEntries.map(e => e.id)).catch(
							err => {
								setEntries(entries);
								alert('Failed to reorder timeline entires');
								console.error(err);
							}
						);
					}}
				>
					{entries.map((e, i) => (
						<EntryCard
							key={e.id}
							entry={e}
							index={i}
							updateEntry={event => updateEvent(event)}
							deleteEntry={() => deleteEvent(i)}
						/>
					))}
				</SortableList>
			</div>
		</div>
	);
};
