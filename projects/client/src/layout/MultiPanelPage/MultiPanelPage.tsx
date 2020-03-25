import React, { FC, MouseEventHandler, ReactNode, useState } from 'react';
import { useEventListener } from '../../util/useEventListener';
import styles from './MultiPanelPage.module.css';
import { MdClose } from 'react-icons/md';
import { Button, WithModal } from '@guardian/threads';
import { ConfirmModal } from '../../components/ConfirmModal/ConfirmModal';

type MultiPanelProps = {
	title?: string;
	id: string;
	children?: ReactNode;
	initialWidth: number;
	onResizePanel?: (width: number) => void;
	onClosePanel: (id: string) => void;
	menu?: ReactNode;
	locked?: boolean;
};

const MIN_WIDTH = 200;

export const MultiPanel: FC<MultiPanelProps> = ({
	id,
	children,
	title,
	initialWidth,
	onClosePanel,
	menu,
	locked,
}) => {
	const [isClosing, setIsClosing] = useState(false);
	const [isResizing, setIsResizing] = useState(false);
	const [width, setWidth] = useState(initialWidth);
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
				setWidth(width + dX);
			} else {
				setWidth(MIN_WIDTH);
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
				{title && <div className={styles.title}>{title}</div>}
				{!!menu && menu}
				{!locked && (
					<WithModal
						isOpen={isClosing}
						setIsOpen={setIsClosing}
						proxy={<Button appearance="transparent" icon={<MdClose />} />}
					>
						<ConfirmModal
							title="Close panel?"
							onCancel={() => setIsClosing(false)}
							onConfirm={() => onClosePanel(id)}
						/>
					</WithModal>
				)}
			</div>
			<div className={styles.panelBody}>{!!children && children}</div>
			<div
				className={styles.panelResizeHandle}
				onMouseDown={onResizerMouseDown}
				onMouseUp={onResizeMouseUp}
			>
				<div className={styles.panelResizeHandleVisual} />
			</div>
		</div>
	);
};

type MultiPanelPageProps = {
	children: ReactNode;
	fab?: ReactNode;
};

export const MultiPanelPage: FC<MultiPanelPageProps> = ({ children, fab }) => {
	return (
		<div className={styles.multiPanelPage}>
			<div className={styles.container}>
				{children}
				<div className={styles.fab}>{fab}</div>
			</div>
		</div>
	);
};
