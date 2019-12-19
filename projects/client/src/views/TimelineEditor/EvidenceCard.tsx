import React, { FC } from 'react';
import {
	MdLink,
	MdAttachFile,
	MdExplore,
	MdAvTimer,
	MdGpsFixed,
	MdAddCircle,
} from 'react-icons/md';

import styles from './EvidenceCard.module.css';

type EvidenceCardProps = {
	type: 'placeholder' | 'link' | 'file' | 'giant' | 'timeline-event';
	title: string;
};

export const EvidenceCard: FC<EvidenceCardProps> = ({ type, title }) => {
	const renderIcon = () => {
		switch (type) {
			case 'placeholder':
				return <MdAddCircle />;
			case 'link':
				return <MdLink />;
			case 'file':
				return <MdAttachFile />;
			case 'giant':
				return <MdExplore />;
			case 'timeline-event':
				return <MdAvTimer />;
			default:
				return <MdGpsFixed />;
		}
	};

	return (
		<li className={styles.cardEvidenceItem}>
			<div>{renderIcon()}</div>
			<div>{title}</div>
		</li>
	);
};
