import { FullScreenApp } from '@guardian/threads';
import React from 'react';
import { render } from 'react-dom';
import styles from './index.module.css';
import { MainMenu } from './MainMenu/MainMenu';
import { AppProvider } from './state/AppState';
import { Header } from './Header/Header';

render(
	<AppProvider>
		<div className={styles.container}>
			<FullScreenApp>
				<div className={styles.wrapper}>
					<Header />
					<div className={styles.content}>
						<MainMenu />
					</div>
				</div>
			</FullScreenApp>
		</div>
	</AppProvider>,
	document.getElementById('root')
);
