import React from 'react';
import { render } from 'react-dom';

import { FacebookScrapeProgress } from './scrapers/FacebookScrapeProgress';

import { mountGrabberOverlays } from './grabber';

import styles from './index.module.css';
import { PageBlocker } from './scrapers/PageBlocker';

const EXTENSION_REACT_MOUNT_ID = 'ferret-mount';
export let reactMount = document.getElementById(EXTENSION_REACT_MOUNT_ID);

console.log('Extension running!');
if (!reactMount) {
	reactMount = document.createElement('div');
	reactMount.id = EXTENSION_REACT_MOUNT_ID;
	reactMount.classList.add(styles.reactMount);

	document.body.appendChild(reactMount);
}

console.log('loaded content scripts');

// Handles content scripts
// Scrapers work by recieving messages which kick start a scrape process

if (false) {
	// if configures to show grabber handles
	//mountGrabberOverlays();
}

function processMessage(message, sender, sendResponse) {
	if (message.type === 'scrape::facebook') {
		render(
			<PageBlocker>
				<FacebookScrapeProgress />
			</PageBlocker>,
			reactMount
		);
	}
}

browser.runtime.onMessage.addListener(processMessage);

console.log('asd');
