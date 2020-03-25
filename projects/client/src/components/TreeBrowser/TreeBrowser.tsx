import React, { Component, ReactNode } from 'react';
import styles from './TreeBrowser.module.css';

type Column = {
	name: string;
	// Where in `fields` is the value of this column found
	field: string;
	// This function takes the column value provided by `field`
	renderFn: (value: any) => string;
	sortFn: (a: any, b: any) => number;
};

export type ColumnConfig = {
	columns: Column[];
	sortAscending: boolean;
	sortColumn: string;
};

export type Entry = {
	path: string;
	name: string;
	icon?: string;
	type: 'file' | 'directory' | 'timeline';

	canRename: boolean;

	onOpen?: () => void;

	fields: any;
};

type TreeBrowserProps = {
	entries: Entry[];

	iconMap: { [key: string]: ReactNode };

	visibleColumns: string[];
	columnConfig: ColumnConfig;
	extraContextMenuItems?: ReactNode;
};

type TreeBrowserState = {
	focusedEntryPaths: string[];
};

export type TreeBrowserFocusEvent =
	| React.MouseEvent<HTMLElement>
	| React.KeyboardEvent<HTMLElement>;

export const isBlob = (entry: any) => {
	return false;
};

export const isDirectory = (entry: any) => {
	return false;
};

export const isTimeline = (entry: any) => {
	return false;
};

export const isLink = (entry: any) => {
	return false;
};

export class TreeBrowser extends Component<TreeBrowserProps, TreeBrowserState> {
	//private entryRefs: RefObject<any>[] = [];
	state: TreeBrowserState = {
		focusedEntryPaths: [],
	};

	onFocusEntry = (metaKey: boolean, entryId: string) => {
		const { focusedEntryPaths } = this.state;

		if (metaKey) {
			if (focusedEntryPaths.includes(entryId)) {
				this.setState({
					focusedEntryPaths: focusedEntryPaths.filter(n => n !== entryId),
				});
			} else {
				this.setState({
					focusedEntryPaths: [...focusedEntryPaths, entryId],
				});
			}
		} else {
			this.setState({
				focusedEntryPaths: [entryId],
			});
		}
	};

	render() {
		const { columnConfig, entries, visibleColumns } = this.props;
		const { focusedEntryPaths: focusedEntryIds } = this.state;

		return (
			<div className={styles.root}>
				<table className={styles.tree}>
					<thead>
						<tr className={styles.header}>
							<td>Name</td>
							{columnConfig.columns
								.filter(column => visibleColumns.includes(column.name))
								.map(column => {
									return <td key={column.name}>{column.name}</td>;
								})}
						</tr>
					</thead>
					<tbody>
						{entries.map(e => {
							// if (isFile(e)) {
							// 	// render file
							// } else {
							// 	// render folder
							// }
						})}
					</tbody>
				</table>
				<div className={styles.dropExtender} />
				<div className={styles.hoverHighligter} />
			</div>
		);
	}
}
