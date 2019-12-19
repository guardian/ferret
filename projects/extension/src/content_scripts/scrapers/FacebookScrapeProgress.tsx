import React, { useEffect, useState } from 'react';

import {
	Button,
	Panel,
	Form,
	FormRow,
	Table,
	SyncSpinner,
} from '@guardian/threads';

import styles from './FacebookScrapeProgress.module.css';
import { MdCheck, MdWarning } from 'react-icons/md';
import { facebookPreflightRules } from '../model/ScraperRules';

type PreflightCheckStatus = 'in-progress' | 'ok' | 'failed';

const getFirstFailingRule = (preflightRules: PreflightRule[]) => {
	for (let i = 0; i < preflightRules.length; i++) {
		const rule = preflightRules[i];
		const selection = document.querySelector(rule.selector);

		if (rule.type === 'must-exist' && selection === null) {
			return rule;
		}

		if (rule.type === 'must-not-exist' && selection != null) {
			return rule;
		}
	}
};

export const FacebookScrapeProgress = () => {
	const [preflightCheck, setPreflightCheck] = useState(
		'in-progress' as PreflightCheckStatus
	);

	useEffect(() => {
		const failingRule = getFirstFailingRule(facebookPreflightRules);

		if (failingRule !== undefined) {
			alert('Preflight failed! ' + failingRule.errorMessage);
			setPreflightCheck('failed');
		} else {
			setPreflightCheck('ok');
		}
	}, []);

	const [posts, setPosts] = useState(0);
	const [images, setImages] = useState(0);
	const [videos, setVideos] = useState(0);
	const [comments, setComments] = useState(0);

	const scrape = () => {
		const reg = new RegExp('https://www.facebook.com/(.*?)/?\\?');
		const getIdFromHref = href => {
			const match = href.match(reg);
			if (match[1]) {
				return match[1];
			} else {
				console.error(
					`Failed to parse user ID from href "${href}" this usually implies a link was found that isn't for a user page`
				);
				return '<unknown>';
			}
		};
		// Foreach post
		document.querySelectorAll("div[role='article'][data-time]").forEach(n => {
			const post: any = {};

			const sharedTextContainer = n.querySelector('._5pcm'); // Is a shared post?
			if (sharedTextContainer) {
				// is shared, get original poster and original post time
				post.isShared = true;
				post.originalPostUserId = getIdFromHref(
					sharedTextContainer
						.querySelector('a[data-hovercard-prefer-more-content-show]')
						.getAttribute('href')
				);

				post.originalPostTime = sharedTextContainer
					.querySelector('abbr[data-utime]')
					.getAttribute('title');
			} else {
				post.isShared = false;
			}

			// Extract original poster
			post.postUserId = getIdFromHref(
				n
					.querySelector('a[data-hovercard-prefer-more-content-show]')
					.getAttribute('href')
			);

			// Extract image
			const maybeImage = n.querySelector('.scaledImageFitWidth');
			if (maybeImage) {
				post.img = maybeImage.getAttribute('src');
			}

			// Extract body text
			post.text = [...n.querySelectorAll('div[data-testid="post_message"] p')]
				.reduce((acc, v) => {
					return acc + '\n\n' + v.textContent.trim();
				}, '')
				.trim();

			post.postTime = n.querySelector('abbr[data-utime]').getAttribute('title');
			console.log(post);
			// TODO Delete element!
		});
	};

	const renderPreflight = () => {
		switch (preflightCheck) {
			case 'in-progress':
				return 'In progress...';
			case 'ok':
				return <MdCheck />;
			case 'failed':
				return <MdWarning />;
		}
	};

	return (
		<Panel title="Scrape Page">
			<FormRow>
				<Table className={styles.statusTable}>
					<thead>
						<tr>
							<th>Stage</th>
							<th>Progress</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Preflight check</td>
							<td>{renderPreflight()}</td>
						</tr>
						<tr>
							<td>Posts</td>
							<td>{posts}</td>
						</tr>
						<tr>
							<td className={styles.dataSecondary}>Images</td>
							<td>{images}</td>
						</tr>
						<tr>
							<td className={styles.dataSecondary}>Videos</td>
							<td>{videos}</td>
						</tr>
						<tr>
							<td className={styles.dataSecondary}>Comments</td>
							<td>{comments}</td>
						</tr>
					</tbody>
				</Table>
			</FormRow>
			<FormRow horizontal>
				<div />
				<Button disabled={preflightCheck !== 'ok'} onClick={scrape}>
					Begin
				</Button>
			</FormRow>
		</Panel>
	);
};
