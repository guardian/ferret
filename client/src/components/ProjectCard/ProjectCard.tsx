import React, { FC, ReactNode } from 'react';

import styles from './ProjectCard.module.css';

type ProjectCardProps = {
	title: string;
	backgroundImage: string;
	onClick: () => void;
	control?: ReactNode;
	controlOnRight?: boolean;
};

export const ProjectCard: FC<ProjectCardProps> = ({
	title,
	onClick,
	backgroundImage,
	control,
	controlOnRight,
}) => {
	return (
		<div className={styles.projectCard}>
			{!!control && (
				<div
					data-right={controlOnRight ? true : null}
					className={styles.control}
				>
					{control}
				</div>
			)}
			<div
				onClick={onClick}
				className={styles.image}
				style={{ backgroundImage: `url(${backgroundImage})` }}
			/>
			<span className={styles.text}>{title}</span>
		</div>
	);
};
