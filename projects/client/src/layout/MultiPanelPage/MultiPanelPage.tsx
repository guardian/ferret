import React, { FC, MouseEventHandler, ReactNode, useState } from 'react';
import { useEventListener } from '../../util/useEventListener';
import styles from './MultiPanelPage.module.css';

export type PanelData = {
	id: string;
	children?: ReactNode;
	width: number;
	title: string;
	menu?: ReactNode;
};

type PanelProps = PanelData & {
	onResizePanel?: (width: number) => void;
};

const MIN_WIDTH = 200;

const Panel: FC<PanelProps> = ({
	children,
	title,
	width,
	onResizePanel,
	menu,
}) => {
	const [isResizing, setIsResizing] = useState(false);
	const [initialX, setInitialX] = useState(0);
	const [widthDiff, setWidthDiff] = useState(0);

	const onResizerMouseDown: MouseEventHandler = e => {
		setIsResizing(true);
		setInitialX(e.pageX);
	};

	const onResizeMouseMove: MouseEventHandler = e => {
		if (!isResizing) {
			return;
		}

		e.preventDefault();

		// Prevent text selection when moving a column
		const selection = window.getSelection();
		if (selection) {
			selection.removeAllRanges();
		}

		const dX = e.pageX - initialX;
		if (width + dX > MIN_WIDTH) {
			setWidthDiff(dX);
		}
	};

	const onResizeMouseUp: MouseEventHandler = e => {
		if (isResizing) {
			const dX = e.pageX - initialX;
			if (width + dX > MIN_WIDTH) {
				onResizePanel && onResizePanel(width + dX);
			} else {
				onResizePanel && onResizePanel(MIN_WIDTH);
			}
			setIsResizing(false);
			setInitialX(e.pageX);
			setWidthDiff(0);
		}
	};

	useEventListener('mousemove', onResizeMouseMove);
	useEventListener('mouseup', onResizeMouseUp);

	return (
		<div
			className={styles.panel}
			style={{ minWidth: width + widthDiff, width: width + widthDiff }}
		>
			<div className={styles.panelHeader}>
				<div className={styles.title}>{title}</div>
				{!!menu && menu}
			</div>
			<div className={styles.panelBody}>{!!children && children}</div>
			{onResizePanel && (
				<div
					className={styles.panelResizeHandle}
					onMouseDown={onResizerMouseDown}
					onMouseUp={onResizeMouseUp}
				>
					<div className={styles.panelResizeHandleVisual} />
				</div>
			)}
		</div>
	);
};

type MultiPanelPageProps = {
	panels: PanelData[];
	onResizePanel?: (id: string, width: number) => void;
};

export const MultiPanelPage: FC<MultiPanelPageProps> = ({
	panels,
	onResizePanel,
}) => {
	return (
		<div className={styles.multiPanelPage}>
			<div className={styles.container}>
				{panels.map(pd => (
					<Panel
						key={pd.id}
						onResizePanel={
							onResizePanel
								? (width: number) => onResizePanel(pd.id, width)
								: undefined
						}
						{...pd}
					/>
				))}
			</div>
		</div>
	);
};
