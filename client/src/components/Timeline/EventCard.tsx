import { Card, getIncrementingAccent, FormRow, Form } from '@guardian/threads';
import React, { FC, useState, DragEventHandler } from 'react';
import { EditableText } from '../../components/EditableText/EditableText';
import styles from './EventCard.module.css';
import { EvidenceCard } from './EvidenceCard';

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
	const [draggingOver, setDraggingOver] = useState(false);

	const handleDragOver: DragEventHandler = e => {
		const { files, items } = e.dataTransfer;
		if (e.dataTransfer.files.length > 0) {
			console.log('drop file!', e.dataTransfer.files);
			setDraggingOver(true);
		}

		if (e.dataTransfer.items.length > 0) {
			console.log('drop item!', e.dataTransfer.items);
			setDraggingOver(true);
		}
	};

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
			<div
				className={styles.card}
				onDragOver={handleDragOver}
				onDragLeave={() => setDraggingOver(false)}
			>
				{draggingOver && <div className={styles.dropIndicator}>Drop it!</div>}
				<FormRow title="Description">
					<EditableText
						text={text}
						multiline
						onChange={text => {
							updateEvent({ ...event, text });
						}}
					/>
				</FormRow>
				<FormRow title="Evidence">
					<ul className={styles.cardEvidenceItems}>
						{evidence.map(e => (
							<EvidenceCard type="link" title={e.name} />
						))}
						<EvidenceCard type="placeholder" title="Add" />
					</ul>
				</FormRow>
			</div>
		</Card>
	);
};
