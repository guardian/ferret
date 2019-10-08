import React, { FC } from 'react';
import {
	WithDropdownMenu,
	MenuItem,
	Button,
	getIncrementingAccent,
	getAccentColor,
} from '@guardian/threads';
import { MdLabelOutline, MdNoteAdd } from 'react-icons/md';

import styles from './Tweet.module.css';
import { TagMenuItem } from '../TagMenuItem/TagMenuItem';

type TweetProps = {
	media: string;
};

export const Tweet: FC<TweetProps> = ({ media }) => {
	return (
		<div className={styles.tweet}>
			<div className={styles.image}>:)</div>
			<div className={styles.text}>
				<div className={styles.meta}>
					<div>
						<span className={styles.username}>Kelly Weill</span>
						<span className={styles.handel}>@KELLYWEILL</span>
					</div>
					<span className={styles.timestamp}>4h</span>
				</div>
				<div>
					<p>
						8chan looks like it’s attempting a return under a slightly different
						name. I’m skeptical that’s going to make much difference with web
						service companies:
					</p>
					{media && <div>Media goes here</div>}
				</div>
			</div>
			<div>
				<Button appearance="toolset" icon={<MdNoteAdd />} />
				<WithDropdownMenu
					origin="left"
					proxy={() => (
						<Button appearance="toolset" icon={<MdLabelOutline />} />
					)}
				>
					<TagMenuItem
						label="HTS"
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
		</div>
	);
};
