import React, { FC, ReactNode } from 'react';
import styles from './ControlBox.module.css';

type ControlBoxProps = {
	children: ReactNode;
};

export const ControlBox: FC<ControlBoxProps> = ({ children }) => {
	return <div className={styles.controlBox}>{children}</div>;
};
