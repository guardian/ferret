import React, { FC, useState } from 'react';
import styles from './EditableText.module.css';

type Mode = 'single' | 'multiline' | 'date';
type EditableTextProps = {
	text: string;
	onChange: (text: string) => void;
	mode?: Mode;
};

export const EditableText: FC<EditableTextProps> = ({
	text,
	onChange,
	mode,
}) => {
	const [editingBody, setEditingBody] = useState(false);
	const [editText, setEditText] = useState(text);

	const usedMode = mode ? mode : 'single';

	const startEdit: React.MouseEventHandler = e => {
		e.stopPropagation();

		setEditText(text);
		setEditingBody(true);
	};

	const onKeyDown: React.KeyboardEventHandler = e => {
		e.stopPropagation();

		if (e.keyCode === 32) {
			e.preventDefault();
			setEditText(editText + ' ');
		}

		if (e.keyCode === 27) {
			setEditingBody(false);
		}

		if (usedMode !== 'multiline' && e.keyCode === 13) {
			onSaveEdit();
		}

		if (usedMode === 'multiline' && e.metaKey && e.keyCode === 13) {
			onSaveEdit();
		}
	};

	const onSaveEdit = () => {
		onChange(editText);
		setEditingBody(false);
	};

	const renderEditable = () => {
		switch (usedMode) {
			case 'single':
				return (
					<input
						autoFocus
						onFocus={e => e.target.select()}
						onKeyDown={onKeyDown}
						onBlur={onSaveEdit}
						onChange={e => setEditText(e.target.value)}
						value={editText}
						className={styles.input}
					/>
				);
			case 'multiline':
				return (
					<textarea
						autoFocus
						onFocus={e => e.target.select()}
						onKeyDown={onKeyDown}
						onBlur={onSaveEdit}
						onChange={e => setEditText(e.target.value)}
						value={editText}
					/>
				);
			case 'date':
				return (
					<input
						autoFocus
						onFocus={e => e.target.select()}
						onKeyDown={onKeyDown}
						onBlur={onSaveEdit}
						onChange={e => setEditText(e.target.value)}
						value={editText}
						className={styles.input}
					/>
				);
		}
	};

	return (
		<div
			className={styles.editableText}
			onClick={startEdit}
			data-multiline={usedMode === 'multiline' ? true : null}
		>
			{editingBody ? (
				renderEditable()
			) : (
				<span className={styles.previewText}>{text}</span>
			)}
		</div>
	);
};
