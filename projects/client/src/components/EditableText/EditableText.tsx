import React, { FC, useState, useCallback } from 'react';
import styles from './EditableText.module.css';
import { parseDate } from './parseDate';
import _ from 'lodash';

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
	const [isValidDate, setIsValidDate] = useState(
		!!parseDate(text, 'from_start')
	);
	const [editingBody, setEditingBody] = useState(false);
	const [editText, setEditText] = useState(text);

	const usedMode = mode ? mode : 'single';

	const startEdit: React.MouseEventHandler = e => {
		e.stopPropagation();
		if (!editingBody) {
			setEditText(text);
			setEditingBody(true);
		}
	};

	const onKeyDown: React.KeyboardEventHandler = e => {
		e.stopPropagation();

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

	const onKeyUp: React.KeyboardEventHandler = e => {
		// There seems to be some slightly weird behaviour where a key up
		// can cause a click in a parent button
		e.preventDefault();
	};

	const onSaveEdit = () => {
		if (editingBody) {
			onChange(editText);
			setEditingBody(false);
		}
	};

	const checkDateValid = () => {
		if (editText === '') {
			setIsValidDate(true);
		} else {
			const date = parseDate(editText, 'from_start');
			setIsValidDate(!!date);
		}
	};

	const debouncedCheckDateValid = useCallback(
		_.debounce(checkDateValid, 500),
		[]
	);

	const renderEditable = () => {
		switch (usedMode) {
			case 'single':
				return (
					<input
						autoFocus
						onFocus={e => e.target.select()}
						onKeyDown={onKeyDown}
						onKeyUp={onKeyUp}
						onBlur={onSaveEdit}
						onChange={e => setEditText(e.target.value)}
						value={editText}
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
						onKeyUp={onKeyUp}
						onBlur={onSaveEdit}
						onChange={e => {
							debouncedCheckDateValid();
							setEditText(e.target.value);
						}}
						value={editText}
					/>
				);
		}
	};

	return (
		<div
			className={styles.editableText}
			onClick={startEdit}
			data-editing={editingBody ? true : null}
			data-mode={usedMode}
			data-invalid-date={usedMode === 'date' && !isValidDate ? true : null}
		>
			{editingBody ? (
				renderEditable()
			) : (
				<span className={styles.previewText}>{text}</span>
			)}
		</div>
	);
};
