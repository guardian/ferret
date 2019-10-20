import { Button } from '@guardian/threads';
import React, { FC, useState } from 'react';
import { MdAddCircle } from 'react-icons/md';
import { EventCard, TimelineEvent } from './EventCard';
import styles from './Timeline.module.css';

type TimelineProps = {};

export const Timeline: FC<TimelineProps> = () => {
	const [events, setEvents] = useState([] as TimelineEvent[]);

	const createEvent = () => ({
		title: 'New Event',
		date: new Date(),
		text: 'Description...',
		evidence: [],
	});

	const updateEvent = (i: number, event: TimelineEvent) => {
		const newEvents = [...events];
		newEvents[i] = event;
		setEvents(newEvents);
	};

	const deleteEvent = (remove: number) => {
		setEvents(events.filter((_, i) => i !== remove));
	};

	return (
		<div className={styles.container}>
			<div className={styles.controls}>
				<Button
					onClick={() => setEvents([...events, createEvent()])}
					icon={<MdAddCircle />}
				/>
			</div>
			<div className={styles.timeline}>
				{events.map((e, i) => (
					<EventCard
						key={i /* fix! */}
						event={e}
						index={i}
						updateEvent={event => updateEvent(i, event)}
						deleteEvent={() => deleteEvent(i)}
					/>
				))}
			</div>
		</div>
	);
};
