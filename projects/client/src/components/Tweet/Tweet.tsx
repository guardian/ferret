import React, { FC } from 'react';
import {
	WithDropdownMenu,
	MenuItem,
	Button,
	getIncrementingAccent,
	getAccentColor,
	MenuSeparator,
} from '@guardian/threads';
import { MdLabelOutline, MdNoteAdd } from 'react-icons/md';

import styles from './Tweet.module.css';
import { TagMenuItem } from '../TagMenuItem/TagMenuItem';

type TweetProps = {
	tweet: any;
	media?: string;
};

export const Tweet: FC<TweetProps> = ({ tweet, media }) => {
	const renderActions = () => (
		<div className={styles.actions}>
			<Button appearance="toolset" icon={<MdNoteAdd />} />
			<WithDropdownMenu
				origin="left"
				proxy={<Button appearance="toolset" icon={<MdLabelOutline />} />}
			>
				<TagMenuItem
					label="Over 9000 Bijis"
					color={getAccentColor(getIncrementingAccent(0))}
				/>
				<TagMenuItem
					label="TFSA"
					color={getAccentColor(getIncrementingAccent(1))}
				/>
				<TagMenuItem
					label="TSK"
					color={getAccentColor(getIncrementingAccent(2))}
				/>
				<TagMenuItem
					label="MIT"
					color={getAccentColor(getIncrementingAccent(3))}
				/>
				<MenuSeparator />
				<MenuItem
					onClick={() => (document.documentElement.dataset.theme = 'aero')}
					label="Delete"
				/>
				<MenuItem
					onClick={() => (document.documentElement.dataset.theme = 'aero')}
					label="Rename"
				/>
			</WithDropdownMenu>
		</div>
	);
	return (
		<div className={styles.tweet}>
			<div className={styles.image}>{renderActions()}</div>
			<div className={styles.text}>
				<div className={styles.meta}>
					<div>
						<span className={styles.username}>{tweet.user.name}</span>
						<span className={styles.handel}>@{tweet.user.screen_name}</span>
					</div>
					<span className={styles.timestamp}>4h</span>
				</div>
				<div>
					<p>{tweet.text}</p>
					{media && <div>Media goes here</div>}
				</div>
			</div>
		</div>
	);
};
