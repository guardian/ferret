import React from 'react';
import { useAppState, back } from '../state/AppState';

import styles from './Header.module.css';
import { Button } from '@guardian/threads';
import { MdArrowBack } from 'react-icons/md';

export const Header = () => {
	const [{ backViews }, dispatch] = useAppState();

	return (
		<header className={styles.header}>
			<div className={styles.buttonContainer}>
				{backViews && backViews.length > 0 && (
					<Button
						className={styles.button}
						appearance="transparent"
						icon={<MdArrowBack />}
						onClick={() => dispatch(back())}
					/>
				)}
			</div>
			<div className={styles.title}>Ferret</div>
		</header>
	);
};
