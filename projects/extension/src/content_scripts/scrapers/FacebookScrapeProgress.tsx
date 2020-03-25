import React, { useEffect, useState } from 'react';

import { Button, Panel, FormRow, Table } from '@guardian/threads';

import styles from './FacebookScrapeProgress.module.css';
import { MdCheck, MdWarning } from 'react-icons/md';
import { facebookPreflightRules } from '../model/ScraperRules';
import { sleep } from '../util/sleep';
import md5 from 'md5';

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

	const [scraping, setScraping] = useState(false);
	const [posts, setPosts] = useState(0);
	const [images, setImages] = useState(0);
	const [videos, setVideos] = useState(0);
	const [comments, setComments] = useState(0);

	const scrapePost = async (n: any, userMap: any) => {
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

		const selectSingle = (rootNode, selector, itemName, optional) => {
			const item = rootNode.querySelector(selector);
			if (!item && !optional) {
				console.error(
					`Failed to select ${itemName} using selector "${selector}"`
				);
			}
			return item;
		};

		const post: any = {};

		const sharedTextContainer = selectSingle(
			n,
			'._5pcm',
			'shared text container',
			true
		); // Is a shared post?

		if (sharedTextContainer) {
			// is shared, get original poster and original post time
			post.isShared = true;
			post.originalPostUserId = getIdFromHref(
				selectSingle(
					sharedTextContainer,
					'a[data-hovercard-prefer-more-content-show]',
					'original post user ID',
					false
				).getAttribute('href')
			);

			const user = userMap[post.originalPostUserId];
			if (!user) {
				// Parse User from document
				post.postUserName = 'Fix extracting original post user name'; // TOOD
				post.postUserAvatar = 'Fix extracting original post user avatar'; // TODO
				userMap[post.postUserId] = { name: '123', avatar: '123' };
			} else {
				post.postUserName = user.name;
				post.postUserAvatar = user.avatar;
			}

			post.originalPostTime = sharedTextContainer
				.querySelector('abbr[data-utime]')
				.getAttribute('title');
		} else {
			post.isShared = false;
		}

		post.postUserId = getIdFromHref(
			selectSingle(
				n,
				'a[data-hovercard-prefer-more-content-show]',
				'poster id',
				false
			).getAttribute('href')
		);

		const user = userMap[post.postUserId];
		if (!user) {
			// Parse User
			post.postUserName = 'Fix extracting post user name'; // TOOD
			post.postUserAvatar = 'Fix extracting  post user avatar'; // TODO
			userMap[post.postUserId] = { name: '123', avatar: '123' };
		} else {
			post.postUserName = user.name;
			post.postUserAvatar = user.avatar;
		}

		// Extract image
		const maybeImage = n.querySelector('.scaledImageFitWidth');
		if (maybeImage) {
			post.img = maybeImage.getAttribute('src');
		}

		// Extract video
		const maybeVideo = n.querySelector('video');
		if (maybeVideo) {
			post.video = maybeVideo.getAttribute('src');
		}

		// Extract body text
		const extractedText = [
			...n.querySelectorAll('div[data-testid="post_message"] p'),
		]
			.reduce((acc, v) => {
				return acc + '\n\n' + v.textContent.trim();
			}, '')
			.trim();

		post.text = extractedText ? extractedText : undefined;

		post.postTime = n.querySelector('abbr[data-utime]').getAttribute('title');

		let depth = 0;
		let commentExpanders = n.querySelectorAll(
			'[data-testid="UFI2CommentsPagerRenderer/pager_depth_0"]'
		);

		const MAX_DEPTH = 5;
		do {
			// click comment expanders
			commentExpanders.forEach(c => c.click());
			commentExpanders = n.querySelectorAll(
				`[data-testid="UFI2CommentsPagerRenderer/pager_depth_${++depth}"]`
			);
		} while (commentExpanders.length > 0 && depth < MAX_DEPTH);

		post.comments = [];
		const commentsContainer = n.querySelector('ul._7791');
		if (commentsContainer) {
			console.log('getting all comments');
			[...commentsContainer.querySelectorAll('li')].map(commentNode => {
				// TODO
				console.log('parsing comment');
				const nameNode = commentNode.querySelector('a._6qw4');
				const textNode = commentNode.querySelector('._3l3x');
				post.comments.push({
					id: 'comment id',
					name: 'comment name',
					avatar: 'comment avatar',
				});
			});
		}

		// Generate an ID for this post so we cna do idempotent updates server side
		post.id = md5(post.postTime + post.text);

		// TODO send to server...
		// Include Dataset ID
		console.log(post);

		// Update counters
		setPosts(posts => posts + 1);
		if (post.img) {
			setImages(images => images + 1);
		}

		if (post.video) {
			setVideos(videos => videos + 1);
		}

		if (post.comments) {
			setComments(comments => comments + post.comments.length);
		}

		n.remove();

		await sleep(500);
	};

	const scrape = async () => {
		setScraping(true);

		console.log('Beginning scrape');

		let posts = document.querySelectorAll("div[role='article'][data-time]");
		console.log(`Found ${posts.length} posts`);

		let users = {};

		do {
			for (let i = 0; i < posts.length; i++) {
				await scrapePost(posts[i], users);
			}

			window.scrollTo(0, document.body.scrollHeight);
			// Wait for more posts to load...
			await sleep(5000);
			window.scrollTo(0, 0);

			posts = document.querySelectorAll("div[role='article'][data-time]");
		} while (posts.length > 0);
		console.log('No posts to scrape, finishing...');

		alert('Done!');
		// TODO Finished message
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
				<Button
					disabled={preflightCheck !== 'ok' || scraping}
					onClick={scrape}
					showSpinner={scraping}
				>
					Begin
				</Button>
			</FormRow>
		</Panel>
	);
};
