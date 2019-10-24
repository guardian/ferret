import { Card, getIncrementingAccent, FormRow, Form } from '@guardian/threads';
import React, { FC, useState, DragEventHandler } from 'react';
import { EditableText } from '../../components/EditableText/EditableText';
import styles from './EntryCard.module.css';
import { EvidenceCard } from './EvidenceCard';
import { TimelineEntry } from '@guardian/ferret-common';

type EntryCardProps = {
	entry: TimelineEntry;
	index: number;
	updateEntry: (e: TimelineEntry) => void;
	deleteEntry: () => void;
};

export const EntryCard: FC<EntryCardProps> = ({
	entry,
	index,
	updateEntry,
	deleteEntry,
}) => {
	const { title, description, happenedOn, evidence } = entry;
	const [happenedOnText, setHappenedOnText] = useState('date');
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
			title={
				<div className={styles.title}>
					<EditableText
						text={title}
						onChange={title => {
							updateEntry({ ...entry, title });
						}}
					/>

					<EditableText
						text={happenedOnText}
						mode="date"
						onChange={date => {
							setHappenedOnText(date);
						}}
					/>
				</div>
			}
			draggable
			onDelete={deleteEntry}
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
						text={description}
						mode="multiline"
						onChange={description => {
							updateEntry({ ...entry, description });
						}}
					/>
				</FormRow>
				{evidence.length > 0 && (
					<FormRow title="Evidence">
						<ul className={styles.cardEvidenceItems}>
							{evidence.map(e => (
								<EvidenceCard type="link" title={e.title} />
							))}
							<EvidenceCard type="placeholder" title="Add" />
						</ul>
					</FormRow>
				)}
			</div>
		</Card>
	);
};
