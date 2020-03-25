import React, { RefObject, createRef, Component, ReactNode } from 'react';
import {
	ColumnConfig,
	Entry,
	TreeBrowserFocusEvent,
	isDirectory,
} from './TreeBrowser';
import { WithContextMenu, MenuItem, MenuSeparator } from '@guardian/threads';

import styles from './EntryRow.module.css';
import { MdChevronRight } from 'react-icons/md';

type EntryRowProps = {
	index: number;
	columnConfig: ColumnConfig;
	entry: Entry;
	focusedEntryPaths: string[];
	extraContextMenuItems?: ReactNode;
	iconMap: { [key: string]: ReactNode };
	onFocusEntry: (metaKey: boolean, path: string) => void;
	focusRowByIndex: (metaKey: boolean, index: number) => void;
};

type EntryRowState = {
	open?: boolean;
};

export class EntryRow extends Component<EntryRowProps, EntryRowState> {
	rowRef: RefObject<HTMLTableRowElement> = createRef<HTMLTableRowElement>();

	state = {
		open: false,
	};

	onClick = (e: TreeBrowserFocusEvent) => {
		e.stopPropagation();
		const { entry } = this.props;

		if (this.rowRef.current) {
			this.rowRef.current.focus();
		}

		this.props.onFocusEntry(e.metaKey, entry.path);
	};

	toggleOpen = () => {};
	open = () => {};
	close = () => {};

	onDoubleClick = (e: React.MouseEvent<HTMLElement>) => {
		const { entry } = this.props;

		if (!e.metaKey && isDirectory(entry)) {
			this.toggleOpen();
		}
	};

	onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
		e.stopPropagation();
		e.preventDefault();

		const { index, focusRowByIndex } = this.props;

		switch (e.key) {
			case 'Enter':
				this.toggleOpen();
				break;
			case 'ArrowLeft':
				this.close();
				break;
			case 'ArrowRight':
				this.open();
				break;
			case 'ArrowUp':
				focusRowByIndex(e.metaKey, index - 1);
				break;
			case 'ArrowDown':
				focusRowByIndex(e.metaKey, index + 1);
				break;
			default:
		}
	};

	render() {
		const {
			columnConfig,
			entry,
			extraContextMenuItems,
			focusedEntryPaths,
			iconMap,
		} = this.props;

		const rowMenu = (
			<React.Fragment>
				<MenuItem label={open ? 'Close' : 'Open'} />
				{entry.canRename && <MenuItem label="Rename" />}
				{extraContextMenuItems ? (
					<React.Fragment>
						<MenuSeparator />
						{extraContextMenuItems}
					</React.Fragment>
				) : null}
			</React.Fragment>
		);

		const depth = entry.path.split('/').length;

		return (
			<WithContextMenu menu={rowMenu}>
				<tr
					ref={this.rowRef}
					draggable
					tabIndex={-1}
					className={styles.row}
					data-focused={focusedEntryPaths.includes(entry.path) ? true : null}
					onClick={this.onClick}
					onDoubleClick={this.onDoubleClick}
					onKeyDown={this.onKeyDown}
				>
					<td>
						<div className={styles.cell}>
							<React.Fragment>
								<div
									style={{
										display: 'inline-block',
										width: `calc(${depth} * var(--sp-large))`,
									}}
								/>
								{isDirectory(entry) ? (
									<MdChevronRight
										className={styles.openIcon}
										data-open={open ? open : null}
									/>
								) : entry.icon && iconMap[entry.icon] ? (
									iconMap[entry.icon]
								) : (
									<div className={styles.iconUnknown}>?</div>
								)}
							</React.Fragment>
							<div>{entry.name}</div>
						</div>
					</td>
					{columnConfig.columns.map(column => {
						const value = entry.fields[column.field];
						return (
							<td key={column.name}>
								<div className={styles.cell}>
									<div>{value ? value : '--'}</div>
								</div>
							</td>
						);
					})}
				</tr>
			</WithContextMenu>
		);
	}
}
