import React, { FC, ChangeEventHandler } from 'react';

import styles from './RadioImage.module.css';

type RadioProps = {
	src?: string;
	checked?: boolean;
	name: string;
	value: string;
	imgClassName?: string;
	label?: string;
	onChange: ChangeEventHandler<HTMLInputElement>;
};

export const Radio: FC<RadioProps> = ({
	src,
	checked,
	name,
	value,
	imgClassName,
	label,
	onChange,
}) => {
	return (
		<label className={styles.root} data-has-image={src ? true : null}>
			<input
				className={styles.radio}
				type="radio"
				name={name}
				value={value}
				checked={checked}
				onChange={onChange}
			/>
			<div className={styles.highlighter} />
			{src && <img className={imgClassName} src={src} />}
			{label && <span>{label}</span>}
		</label>
	);
};
