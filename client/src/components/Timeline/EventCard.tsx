import { Card, getIncrementingAccent } from '@guardian/threads';
import React, { FC, useState } from 'react';
import { EditableText } from '../../components/EditableText/EditableText';
import styles from './EventCard.module.css';

type Evidence = {
	name: string;
};

export type TimelineEvent = {
	title: string;
	date: Date;
	text: string;
	evidence: Evidence[];
};

type EventCardProps = {
	event: TimelineEvent;
	index: number;
	updateEvent: (e: TimelineEvent) => void;
	deleteEvent: () => void;
};

export const EventCard: FC<EventCardProps> = ({
	event,
	index,
	updateEvent,
	deleteEvent,
}) => {
	const { title, date, text, evidence } = event;

	const [editingBody, setEditingBody] = useState(false);

	return (
		<Card
			key={index}
			title={
				<EditableText
					text={title}
					onChange={title => {
						updateEvent({ ...event, title });
					}}
				/>
			}
			onDelete={deleteEvent}
			accent={getIncrementingAccent(index)}
		>
			<div>
				<EditableText
					text={text}
					multiline
					onChange={text => {
						updateEvent({ ...event, text });
					}}
				/>
				{evidence.length > 0 && (
					<div className={styles.cardEvidence}>
						Links/Evidence/Attachments
						<ul className={styles.cardEvidenceItems}>
							{evidence.length === 0 ? (
								<li className={styles.cardEvidenceItemPlaceholder}>
									Add evidence
								</li>
							) : (
								evidence.map(e => (
									<li className={styles.cardEvidenceItem}>{e.name}</li>
								))
							)}
						</ul>
					</div>
				)}
			</div>
		</Card>
	);
};
