import React from 'react';

import styles from './PageBlocker.module.css';

export const PageBlocker = ({ children }) => {
	return (
		<div className={styles.blocker}>
			<div className={styles.aligner}>{children}</div>
		</div>
	);
};
