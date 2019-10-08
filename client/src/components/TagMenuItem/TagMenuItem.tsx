import React, { FC } from 'react';

import styles from './TagMenuItem.module.css';

type TagMenuItemProps = {
	label: string;
	color: string;
};

export const TagMenuItem: FC<TagMenuItemProps> = ({ label, color }) => {
	return (
		<div className={styles.tag} style={{ backgroundColor: color }}>
			{label}
		</div>
	);
};
