import React, { FC, ReactNode, CSSProperties } from 'react';

import styles from './MenuCard.module.css';
import { MdArrowForward } from 'react-icons/md';

type ProjectCardProps = {
	title: string;
	backgroundColor?: string;
	backgroundImage?: string;
	onClick?: () => void;
	leftControl?: ReactNode;
	rightControl?: ReactNode;
	style?: CSSProperties;
	disabled?: boolean;
};

export const MenuCard: FC<ProjectCardProps> = ({
	title,
	onClick,
	backgroundColor,
	backgroundImage,
	leftControl,
	rightControl,
	style,
	disabled,
}) => {
	const mixedStyle = { ...style, backgroundColor };

	return (
		<button
			disabled={disabled}
			className={styles.projectCard}
			style={mixedStyle}
			onClick={onClick}
		>
			{!!rightControl && (
				<div className={styles.rightControl}>{rightControl}</div>
			)}
			{!!leftControl && <div className={styles.leftControl}>{leftControl}</div>}
			{backgroundImage && (
				<div
					onClick={onClick}
					className={styles.image}
					style={{ backgroundImage: `url(${backgroundImage})` }}
				/>
			)}
			<span className={styles.text}>{title}</span>
			<div className={styles.arrow}>
				<MdArrowForward />
			</div>
		</button>
	);
};
