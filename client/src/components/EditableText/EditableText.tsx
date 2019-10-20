import React, { FC, useState } from 'react';
import styles from './EditableText.module.css';

type EditableTextProps = {
	text: string;
	onChange: (text: string) => void;
	multiline?: boolean;
};

export const EditableText: FC<EditableTextProps> = ({
	text,
	onChange,
	multiline,
}) => {
	const [editingBody, setEditingBody] = useState(false);
	const [editText, setEditText] = useState(text);

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

		if (!multiline && e.keyCode === 13) {
			onSaveEdit();
		}

		if (multiline && e.metaKey && e.keyCode === 13) {
			onSaveEdit();
		}
	};

	const onSaveEdit = () => {
		onChange(editText);
		setEditingBody(false);
	};

	return (
		<div
			className={styles.editableText}
			onClick={startEdit}
			data-multiline={multiline ? multiline : null}
		>
			{editingBody ? (
				multiline ? (
					<textarea
						autoFocus
						onFocus={e => e.target.select()}
						onKeyDown={onKeyDown}
						onBlur={onSaveEdit}
						onChange={e => setEditText(e.target.value)}
						value={editText}
					/>
				) : (
					<input
						autoFocus
						onFocus={e => e.target.select()}
						onKeyDown={onKeyDown}
						onBlur={onSaveEdit}
						onChange={e => setEditText(e.target.value)}
						value={editText}
						className={styles.input}
					/>
				)
			) : (
				<span className={styles.previewText}>{text}</span>
			)}
		</div>
	);
};
