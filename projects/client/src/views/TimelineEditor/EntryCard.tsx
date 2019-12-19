import { TimelineEntry } from '@guardian/ferret-common';
import {
	Card,
	EditableText,
	FormRow,
	getIncrementingAccent,
} from '@guardian/threads';
import React, {
	Component,
	DragEventHandler,
	useState,
	createRef,
	RefObject,
} from 'react';
import styles from './EntryCard.module.css';
import { EvidenceCard } from './EvidenceCard';

type EntryCardProps = {
	entry: TimelineEntry;
	index: number;
	updateEntry: (e: TimelineEntry) => void;
	deleteEntry: () => void;
};

type EntryCardState = {
	draggingOver: boolean;
};

export class EntryCard extends Component<EntryCardProps, EntryCardState> {
	cardRef: RefObject<Card> = createRef();

	state: EntryCardState = {
		draggingOver: false,
	};

	collapse = () => {
		if (this.cardRef.current) {
			this.cardRef.current.setOpen(false);
		}
	};

	onDragOver = () => {};

	onDragLeave = () => {};

	render() {
		const { updateEntry, deleteEntry, entry, index } = this.props;
		const { draggingOver } = this.state;

		const { title, description, happenedOn, evidence } = entry;

		return (
			<Card
				ref={this.cardRef}
				title={
					<div className={styles.title}>
						<EditableText
							text={title}
							onChange={title => {
								updateEntry({ ...entry, title });
							}}
						/>

						<EditableText
							text={happenedOn ? happenedOn : 'Unknown'}
							mode="date"
							onChange={happenedOn => {
								updateEntry({
									...entry,
									happenedOn,
								});
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
					onDragOver={this.onDragOver}
					onDragLeave={this.onDragLeave}
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
	}
}
