import React, { useState } from 'react';
import { Form, FormRow, Button } from '@guardian/threads';
import styles from './Scrapers.module.css';

export const FacebookScraper = () => {
	const [url, setUrl] = useState('https://www.facebook.com/buckey.wolfe.39');

	const beginScrape = () => {
		if (url.includes('facebook.com')) {
			const scrapeRequest = {
				type: 'scrape::facebook',
				url: url,
			};

			browser.runtime.sendMessage(browser.runtime.id, scrapeRequest);
		}
	};

	return (
		<div className={styles.wrapper}>
			<Form onSubmit={() => {}} title="Scrape Facebook Profile">
				<FormRow title="Profile URL">
					<input
						autoFocus
						value={url}
						className={styles.textInput}
						type="text"
						placeholder="Profile URL"
						onChange={e => setUrl(e.target.value)}
					/>
				</FormRow>
				<FormRow>
					<Button
						disabled={!/https?:\/\/www.facebook.com\/(.*?)/.test(url)}
						onClick={beginScrape}
					>
						Go
					</Button>
				</FormRow>
			</Form>
		</div>
	);
};
