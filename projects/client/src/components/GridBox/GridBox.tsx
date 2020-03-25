import React, { FC, ReactNode } from 'react';
import styles from './GridBox.module.css';

type GridBoxProps = {
	children: ReactNode;
	emptyMessage: string;
};

export const GridBox: FC<GridBoxProps> = ({ children, emptyMessage }) => {
	const count = React.Children.count(children);
	if (count == 0) {
		return <div className={styles.emptyMessage}>{emptyMessage}</div>;
	} else {
		return <div className={styles.grid}>{children}</div>;
	}
};
