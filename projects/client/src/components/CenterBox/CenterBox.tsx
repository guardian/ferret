import React, { FC, ReactNode } from 'react';
import styles from './CenterBox.module.css';

export const CenterBox: FC<{ children: ReactNode }> = ({ children }) => {
	return <div className={styles.box}>{children}</div>;
};
