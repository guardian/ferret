import {
	Button,
	SortableList,
	WithDropdownMenu,
	MenuSeparator,
	MenuItem,
	WithModal,
} from '@guardian/threads';
import React, {
	FC,
	useState,
	useEffect,
	useRef,
	createRef,
	Component,
	Ref,
	RefObject,
} from 'react';
import { MdAddCircle, MdMenu } from 'react-icons/md';
import { GoDiffRemoved } from 'react-icons/go';
import { EntryCard } from './EntryCard';
import styles from './Timeline.module.css';
import { TimelineEntry } from '@guardian/ferret-common';
import {
	getTimelineEntries,
	updateTimelineEntry,
	createTimelineEntry,
	reorderTimelineEntries,
	deleteTimelineEntry,
} from '../../services/project';
import _ from 'lodash';
import { parseDate } from '../../components/EditableText/parseDate';
import { create } from 'istanbul-reports';

type TimelineProps = { pId: string; tId: string };
type TimelineEntriesEditorState = {
	entries: TimelineEntry[];
};

export class TimelineEntriesEditor extends Component<
	TimelineProps,
	TimelineEntriesEditorState
> {
	cardRefs: RefObject<EntryCard>[] = [];

	state: TimelineEntriesEditorState = {
		entries: [],
	};

	componentDidMount() {
		this.getEntries();
	}

	debouncedServerUpdate = _.debounce(updateTimelineEntry, 1000);

	getEntries = () => {
		const { pId, tId } = this.props;
		getTimelineEntries(pId, tId)
			.then(e => this.setEntries(e))
			.catch(e => console.error(e));
	};

	setEntries = (entries: TimelineEntry[]) => {
		this.setState({
			entries,
		});
	};

	deleteEvent = (id: string) => {
		const { pId, tId } = this.props;
		deleteTimelineEntry(pId, tId, id);
		this.setEntries(this.state.entries.filter(e => e.id !== id));
	};

	updateEvent = (entry: TimelineEntry) => {
		const { pId, tId } = this.props;
		const { entries } = this.state;
		const newEntries = [...entries];

		const i = entries.findIndex(e => e.id === entry.id);
		newEntries[i] = entry;

		this.debouncedServerUpdate(pId, tId, entry.id, entry);
		this.setEntries(newEntries);
	};

	onReorderCards = (from: number, to: number) => {
		const { pId, tId } = this.props;
		const oldEntires = this.state.entries;
		let newEntries = [...oldEntires];
		newEntries.splice(to, 0, ...newEntries.splice(from, 1));
		this.setEntries(newEntries);

		reorderTimelineEntries(pId, tId, newEntries.map(e => e.id)).catch(err => {
			this.setEntries(oldEntires);
			alert('Failed to reorder timeline entires');
			console.error(err);
		});
	};

	render() {
		const { pId, tId } = this.props;

		const { entries } = this.state;

		this.cardRefs = [...entries].map(() => createRef());

		const entriesToText = () => {
			let out = '';

			entries.forEach(e => {
				const date = parseDate(e.happenedOn as string, 'from_start');
				const dateText = date
					? new Date(date).toDateString()
					: '<Unknown Date>';
				out += `${dateText} — ${e.title}

${e.description}

***********

`;
			});
			var el = document.createElement('textarea');
			el.value = out;
			el.setAttribute('readonly', '');
			el.style.position = 'absolute';
			el.style.left = '-999999px';
			document.body.appendChild(el);
			el.select();
			document.execCommand('copy');
			document.body.removeChild(el);
			alert('Text copied to clipboard!');
		};

		return (
			<div className={styles.container}>
				<div className={styles.controls}>
					<div className={styles.buttons}>
						<Button
							onClick={() =>
								createTimelineEntry(
									pId,
									tId,
									'New Event',
									'Description...',
									[]
								).then(this.getEntries)
							}
							icon={<MdAddCircle />}
						>
							New Event
						</Button>
						<Button
							onClick={() => {
								this.cardRefs.forEach(ref => {
									console.log('clicky');
									if (ref.current) {
										ref.current.collapse();
									}
								});
							}}
							icon={<GoDiffRemoved />}
						>
							Collapse All
						</Button>
					</div>
					<WithDropdownMenu proxy={<Button icon={<MdMenu />} />}>
						<MenuItem disabled label="New Event" />
						<MenuItem disabled label="Rename Timeline" />
						<MenuSeparator />
						<MenuItem label="Copy as Text" onClick={entriesToText} />
						<MenuItem disabled label="Copy as JSON" />
					</WithDropdownMenu>
				</div>
				<div className={styles.timeline}>
					<SortableList hasOwnDragRegion onUpdate={this.onReorderCards}>
						{entries.map((e, i) => (
							<EntryCard
								ref={this.cardRefs[i]}
								key={e.id}
								entry={e}
								index={i}
								updateEntry={event => this.updateEvent(event)}
								deleteEntry={() => this.deleteEvent(e.id)}
							/>
						))}
					</SortableList>
				</div>
			</div>
		);
	}
}
